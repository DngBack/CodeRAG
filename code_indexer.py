import os
import lancedb
import pandas as pd
from typing import List, Dict, Any, Optional
from pathlib import Path
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import numpy as np
import pyarrow as pa


class CodeIndexer:
    def __init__(
        self, db_path: str = "code_database", openai_api_key: Optional[str] = None
    ):
        """Initialize the code indexer with LanceDB"""
        self.db_path = db_path
        self.db = lancedb.connect(db_path)

        # Initialize OpenAI embeddings
        if openai_api_key:
            os.environ["OPENAI_API_KEY"] = openai_api_key
        self.embeddings = OpenAIEmbeddings()

        # Text splitter for long code chunks
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, separators=["\n\n", "\n", " ", ""]
        )

        # Initialize or get the table
        self.table = self._get_or_create_table()

    def _get_or_create_table(self):
        """Get existing table or create new one"""
        try:
            table = self.db.open_table("code_chunks")
            print("Using existing table: code_chunks")
            return table
        except:
            print("Creating new table: code_chunks")
            # Create schema for the table using PyArrow
            schema = pa.schema(
                [
                    pa.field("id", pa.string()),
                    pa.field("file_path", pa.string()),
                    pa.field("file_name", pa.string()),
                    pa.field("chunk_type", pa.string()),
                    pa.field("chunk_name", pa.string()),
                    pa.field("code", pa.string()),
                    pa.field("start_line", pa.int32()),
                    pa.field("end_line", pa.int32()),
                    pa.field("total_lines", pa.int32()),
                    pa.field("file_size", pa.int32()),
                    pa.field(
                        "embedding", pa.list_(pa.float32(), 1536)
                    ),  # OpenAI embedding dimension
                    pa.field(
                        "metadata", pa.string()
                    ),  # JSON string for additional metadata
                ]
            )

            return self.db.create_table("code_chunks", schema=schema)

    def _create_chunk_id(
        self, file_path: str, chunk_type: str, chunk_name: str, start_line: int
    ) -> str:
        """Create a unique ID for each chunk"""
        return f"{file_path}:{chunk_type}:{chunk_name}:{start_line}"

    def _split_long_code(self, code: str) -> List[str]:
        """Split long code into smaller chunks if needed"""
        if len(code) <= 1000:
            return [code]

        return self.text_splitter.split_text(code)

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using OpenAI"""
        try:
            embedding = self.embeddings.embed_query(text)
            return embedding
        except Exception as e:
            print(f"Error getting embedding: {e}")
            # Return zero vector as fallback
            return [0.0] * 1536

    def index_chunks(self, chunks: List[Dict[str, Any]]) -> int:
        """Index code chunks into LanceDB"""
        indexed_count = 0

        for chunk in chunks:
            # Split long code if needed
            code_parts = self._split_long_code(chunk["code"])

            for i, code_part in enumerate(code_parts):
                # Create unique ID
                chunk_id = self._create_chunk_id(
                    chunk["file_path"],
                    chunk["type"],
                    chunk.get("name", "unnamed"),
                    chunk["start_line"],
                )

                if len(code_parts) > 1:
                    chunk_id += f":part_{i}"

                # Get embedding for the code
                embedding = self._get_embedding(code_part)

                # Prepare metadata
                metadata = {
                    "node_type": chunk.get("node_type", ""),
                    "part_index": i,
                    "total_parts": len(code_parts),
                }

                # Create record
                record = {
                    "id": chunk_id,
                    "file_path": chunk["file_path"],
                    "file_name": chunk["file_name"],
                    "chunk_type": chunk["type"],
                    "chunk_name": chunk.get("name", "unnamed"),
                    "code": code_part,
                    "start_line": chunk["start_line"],
                    "end_line": chunk["end_line"],
                    "total_lines": chunk["total_lines"],
                    "file_size": chunk["file_size"],
                    "embedding": embedding,
                    "metadata": str(metadata),
                }

                # Insert into table
                try:
                    self.table.add([record])
                    indexed_count += 1
                except Exception as e:
                    print(f"Error indexing chunk {chunk_id}: {e}")

        print(f"Successfully indexed {indexed_count} chunks")
        return indexed_count

    def search_similar(
        self, query: str, limit: int = 10, threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """Search for similar code chunks using semantic search"""
        # Get query embedding
        query_embedding = self._get_embedding(query)

        # Search in the table using vector similarity
        results = (
            self.table.search(query_embedding, vector_column_name="embedding")
            .limit(limit)
            .to_pandas()
        )

        # Filter by similarity threshold
        filtered_results = []
        for _, row in results.iterrows():
            # Calculate cosine similarity
            similarity = self._cosine_similarity(query_embedding, row["embedding"])
            if similarity >= threshold:
                result_dict = row.to_dict()
                result_dict["similarity"] = similarity
                filtered_results.append(result_dict)

        # Sort by similarity
        filtered_results.sort(key=lambda x: x["similarity"], reverse=True)

        return filtered_results

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)

        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    def search_by_keyword(self, keyword: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search for code chunks containing specific keywords"""
        # Search in code content using SQL-like query
        results = (
            self.table.search(
                f"code LIKE '%{keyword}%' OR chunk_name LIKE '%{keyword}%'"
            )
            .limit(limit)
            .to_pandas()
        )

        return results.to_dict("records")

    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        total_chunks = len(self.table)

        # Get chunk type distribution
        chunk_types = self.table.to_pandas()["chunk_type"].value_counts().to_dict()

        # Get file distribution
        file_counts = self.table.to_pandas()["file_name"].value_counts().to_dict()

        return {
            "total_chunks": total_chunks,
            "chunk_types": chunk_types,
            "files": file_counts,
        }
