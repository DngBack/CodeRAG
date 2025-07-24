
import os
from typing import List, Dict, Any, Optional

import lancedb
import numpy as np
import pyarrow as pa
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter



class CodeIndexer:
    """
    CodeIndexer indexes code chunks into LanceDB, generating embeddings from detailed descriptions.
    It supports chunk splitting, embedding, and semantic/keyword search.
    """

    def __init__(self, db_path: str = "code_database", openai_api_key: Optional[str] = None):
        """
        Initialize the code indexer with LanceDB and OpenAI embeddings.
        """
        self.db_path = db_path
        self.db = lancedb.connect(db_path)

        if openai_api_key:
            os.environ["OPENAI_API_KEY"] = openai_api_key
        self.embeddings = OpenAIEmbeddings()

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, separators=["\n\n", "\n", " ", ""]
        )
        self.table = self._get_or_create_table()

    def _get_or_create_table(self):
        """
        Get existing table or create a new one with the required schema.
        """
        try:
            table = self.db.open_table("code_chunks")
            print("Using existing table: code_chunks")
            return table
        except Exception:
            print("Creating new table: code_chunks")
            schema = pa.schema([
                pa.field("id", pa.string()),
                pa.field("file_path", pa.string()),
                pa.field("file_name", pa.string()),
                pa.field("chunk_type", pa.string()),
                pa.field("chunk_name", pa.string()),
                pa.field("code", pa.string()),
                pa.field("description", pa.string()),
                pa.field("start_line", pa.int32()),
                pa.field("end_line", pa.int32()),
                pa.field("total_lines", pa.int32()),
                pa.field("file_size", pa.int32()),
                pa.field("embedding", pa.list_(pa.float32(), 1536)),
                pa.field("metadata", pa.string()),
            ])
            return self.db.create_table("code_chunks", schema=schema)


    def _create_chunk_id(self, file_path: str, chunk_type: str, chunk_name: str, start_line: int) -> str:
        """
        Create a unique ID for each chunk.
        """
        return f"{file_path}:{chunk_type}:{chunk_name}:{start_line}"


    def _split_long_code(self, code: str) -> List[str]:
        """
        Split long code into smaller chunks if needed.
        """
        if len(code) <= 1000:
            return [code]
        return self.text_splitter.split_text(code)


    def _get_embedding(self, text: str) -> List[float]:
        """
        Get embedding for text using OpenAI. Returns a zero vector on failure.
        """
        try:
            return self.embeddings.embed_query(text)
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return [0.0] * 1536


    def _generate_description(self, chunk: Dict[str, Any], code_part: str) -> str:
        """
        Generate a detailed description for a code chunk, including file path, chunk info, and purpose.
        """
        desc = (
            f"File: {chunk['file_path']}\n"
            f"Chunk Name: {chunk.get('name', 'unnamed')}\n"
            f"Chunk Type: {chunk.get('type', '')}\n"
            f"Start Line: {chunk.get('start_line', '')}, End Line: {chunk.get('end_line', '')}\n"
            f"Total Lines: {chunk.get('total_lines', '')}\n"
            "Purpose: "
        )
        # Try to extract a docstring or comment from the code_part for purpose
        doc = ""
        for line in code_part.strip().splitlines():
            s = line.strip()
            if s.startswith('"""') or s.startswith("'''"):
                doc = s.strip('"\'')
                break
            if s.startswith('#'):
                doc = s.lstrip('#').strip()
                break
        if doc:
            desc += doc
        else:
            desc += "No explicit docstring or comment found. This chunk may define a function, class, or code block."
        return desc


    def index_chunks(self, chunks: List[Dict[str, Any]]) -> int:
        """
        Index code chunks into LanceDB with detailed description and embed the description instead of code.
        Returns the number of successfully indexed chunks.
        """
        indexed_count = 0
        for chunk in chunks:
            code_parts = self._split_long_code(chunk["code"])
            for i, code_part in enumerate(code_parts):
                chunk_id = self._create_chunk_id(
                    chunk["file_path"],
                    chunk["type"],
                    chunk.get("name", "unnamed"),
                    chunk["start_line"],
                )
                if len(code_parts) > 1:
                    chunk_id += f":part_{i}"
                description = self._generate_description(chunk, code_part)
                embedding = self._get_embedding(description)
                metadata = {
                    "node_type": chunk.get("node_type", ""),
                    "part_index": i,
                    "total_parts": len(code_parts),
                }
                record = {
                    "id": chunk_id,
                    "file_path": chunk["file_path"],
                    "file_name": chunk["file_name"],
                    "chunk_type": chunk["type"],
                    "chunk_name": chunk.get("name", "unnamed"),
                    "code": code_part,
                    "description": description,
                    "start_line": chunk["start_line"],
                    "end_line": chunk["end_line"],
                    "total_lines": chunk["total_lines"],
                    "file_size": chunk["file_size"],
                    "embedding": embedding,
                    "metadata": str(metadata),
                }
                try:
                    self.table.add([record])
                    indexed_count += 1
                except Exception as e:
                    print(f"Error indexing chunk {chunk_id}: {e}")
        print(f"Successfully indexed {indexed_count} chunks")
        return indexed_count


    def search_similar(self, query: str, limit: int = 10, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """
        Search for similar code chunks using semantic search.
        Returns a list of result dicts with similarity scores.
        """
        query_embedding = self._get_embedding(query)
        results = (
            self.table.search(query_embedding, vector_column_name="embedding")
            .limit(limit)
            .to_pandas()
        )
        filtered_results = []
        for _, row in results.iterrows():
            similarity = self._cosine_similarity(query_embedding, row["embedding"])
            if similarity >= threshold:
                result_dict = row.to_dict()
                result_dict["similarity"] = similarity
                filtered_results.append(result_dict)
        filtered_results.sort(key=lambda x: x["similarity"], reverse=True)
        return filtered_results


    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Calculate cosine similarity between two vectors.
        """
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return float(np.dot(vec1, vec2) / (norm1 * norm2))


    def search_by_keyword(self, keyword: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search for code chunks containing specific keywords in code or chunk name.
        """
        results = (
            self.table.search(
                f"code LIKE '%{keyword}%' OR chunk_name LIKE '%{keyword}%'"
            )
            .limit(limit)
            .to_pandas()
        )
        return results.to_dict("records")


    def get_stats(self) -> Dict[str, Any]:
        """
        Get database statistics: total chunks, chunk type distribution, and file distribution.
        """
        total_chunks = len(self.table)
        df = self.table.to_pandas()
        chunk_types = df["chunk_type"].value_counts().to_dict()
        file_counts = df["file_name"].value_counts().to_dict()
        return {
            "total_chunks": total_chunks,
            "chunk_types": chunk_types,
            "files": file_counts,
        }
