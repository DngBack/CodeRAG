// Note: Install these packages with npm:
// npm install @lancedb/lancedb @langchain/openai langchain @types/node

// For now, we'll use type declarations that match the expected API
// In a real implementation, you would install the actual packages

interface LanceDBConnection {
  openTable(name: string): Promise<LanceDBTable>;
  createTable(name: string, data: any[]): Promise<LanceDBTable>;
}

interface LanceDBTable {
  add(records: any[]): Promise<void>;
  vectorSearch(vector: number[]): {
    limit(n: number): {
      toArray(): Promise<any[]>;
    };
  };
  search(query: string): {
    limit(n: number): {
      toArray(): Promise<any[]>;
    };
  };
  toArray(): Promise<any[]>;
  delete(condition: string): Promise<void>;
}

interface OpenAIEmbeddingsInterface {
  embedQuery(text: string): Promise<number[]>;
}

interface TextSplitterInterface {
  splitText(text: string): Promise<string[]>;
}

// Mock implementations - replace with actual imports when packages are installed
const lancedb = {
  connect: async (path: string): Promise<LanceDBConnection> => {
    throw new Error("LanceDB not installed. Run: npm install @lancedb/lancedb");
  }
};

class OpenAIEmbeddings implements OpenAIEmbeddingsInterface {
  async embedQuery(text: string): Promise<number[]> {
    throw new Error("OpenAI embeddings not installed. Run: npm install @langchain/openai");
  }
}

class RecursiveCharacterTextSplitter implements TextSplitterInterface {
  constructor(options: { chunkSize: number; chunkOverlap: number; separators: string[] }) {
    // Mock constructor
  }
  
  async splitText(text: string): Promise<string[]> {
    throw new Error("LangChain text splitter not installed. Run: npm install langchain");
  }
}

// Type definitions
export interface CodeChunk {
  file_path: string;
  file_name: string;
  type: string;
  name?: string;
  code: string;
  start_line: number;
  end_line: number;
  total_lines: number;
  file_size: number;
  node_type?: string;
}

export interface CodeRecord {
  id: string;
  file_path: string;
  file_name: string;
  chunk_type: string;
  chunk_name: string;
  code: string;
  description: string;
  start_line: number;
  end_line: number;
  total_lines: number;
  file_size: number;
  embedding: number[];
  metadata: string;
}

export interface SearchResult extends CodeRecord {
  similarity: number;
}

interface Stats {
  total_chunks: number;
  chunk_types: Record<string, number>;
  files: Record<string, number>;
}

interface ChunkMetadata {
  node_type: string;
  part_index: number;
  total_parts: number;
}

/**
 * CodeIndexer indexes code chunks into LanceDB, generating embeddings from detailed descriptions.
 * It supports chunk splitting, embedding, and semantic/keyword search.
 */
export class CodeIndexer {
  private dbPath: string;
  private db!: LanceDBConnection;
  private embeddings: OpenAIEmbeddingsInterface;
  private textSplitter: TextSplitterInterface;
  private table!: LanceDBTable;

  constructor(dbPath: string = "code_database", openaiApiKey?: string) {
    this.dbPath = dbPath;
    
    if (openaiApiKey) {
      process.env.OPENAI_API_KEY = openaiApiKey;
    }
    
    this.embeddings = new OpenAIEmbeddings();
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", " ", ""]
    });
  }

  /**
   * Initialize the database connection and table
   */
  async initialize(): Promise<void> {
    this.db = await lancedb.connect(this.dbPath);
    this.table = await this.getOrCreateTable();
  }

  /**
   * Get existing table or create a new one with the required schema.
   */
  private async getOrCreateTable(): Promise<LanceDBTable> {
    try {
      const table = await this.db.openTable("code_chunks");
      console.log("Using existing table: code_chunks");
      return table;
    } catch (error) {
      console.log("Creating new table: code_chunks");
      
      // Create sample data to infer schema
      const sampleData: CodeRecord[] = [{
        id: "sample",
        file_path: "sample.ts",
        file_name: "sample.ts",
        chunk_type: "function",
        chunk_name: "sample",
        code: "function sample() {}",
        description: "Sample function",
        start_line: 1,
        end_line: 1,
        total_lines: 1,
        file_size: 100,
        embedding: new Array(1536).fill(0),
        metadata: "{}"
      }];
      
      const table = await this.db.createTable("code_chunks", sampleData);
      // Delete the sample record
      await table.delete("id = 'sample'");
      return table;
    }
  }

  /**
   * Create a unique ID for each chunk.
   */
  private createChunkId(filePath: string, chunkType: string, chunkName: string, startLine: number): string {
    return `${filePath}:${chunkType}:${chunkName}:${startLine}`;
  }

  /**
   * Split long code into smaller chunks if needed.
   */
  private async splitLongCode(code: string): Promise<string[]> {
    if (code.length <= 1000) {
      return [code];
    }
    return await this.textSplitter.splitText(code);
  }

  /**
   * Get embedding for text using OpenAI. Returns a zero vector on failure.
   */
  private async getEmbedding(text: string): Promise<number[]> {
    try {
      return await this.embeddings.embedQuery(text);
    } catch (error) {
      console.error(`Error getting embedding: ${error}`);
      return new Array(1536).fill(0);
    }
  }

  /**
   * Generate a detailed description for a code chunk, including file path, chunk info, and purpose.
   */
  private generateDescription(chunk: CodeChunk, codePart: string): string {
    let desc = `File: ${chunk.file_path}\n` +
               `Chunk Name: ${chunk.name || 'unnamed'}\n` +
               `Chunk Type: ${chunk.type}\n` +
               `Start Line: ${chunk.start_line}, End Line: ${chunk.end_line}\n` +
               `Total Lines: ${chunk.total_lines}\n` +
               `Purpose: `;

    // Try to extract a docstring or comment from the code_part for purpose
    let doc = "";
    const lines = codePart.trim().split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        doc = trimmed.replace(/['"]/g, '');
        break;
      }
      if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
        doc = trimmed.replace(/^[#\/]+\s*/, '');
        break;
      }
      if (trimmed.startsWith('/**') || trimmed.startsWith('/*')) {
        doc = trimmed.replace(/^\/\*+\s*/, '').replace(/\*+\/$/, '');
        break;
      }
    }

    if (doc) {
      desc += doc;
    } else {
      desc += "No explicit docstring or comment found. This chunk may define a function, class, or code block.";
    }

    return desc;
  }

  /**
   * Index code chunks into LanceDB with detailed description and embed the description instead of code.
   * Returns the number of successfully indexed chunks.
   */
  async indexChunks(chunks: CodeChunk[]): Promise<number> {
    let indexedCount = 0;
    
    for (const chunk of chunks) {
      const codeParts = await this.splitLongCode(chunk.code);
      
      for (let i = 0; i < codeParts.length; i++) {
        const codePart = codeParts[i];
        let chunkId = this.createChunkId(
          chunk.file_path,
          chunk.type,
          chunk.name || "unnamed",
          chunk.start_line
        );
        
        if (codeParts.length > 1) {
          chunkId += `:part_${i}`;
        }
        
        const description = this.generateDescription(chunk, codePart);
        const embedding = await this.getEmbedding(description);
        
        const metadata: ChunkMetadata = {
          node_type: chunk.node_type || "",
          part_index: i,
          total_parts: codeParts.length
        };
        
        const record: CodeRecord = {
          id: chunkId,
          file_path: chunk.file_path,
          file_name: chunk.file_name,
          chunk_type: chunk.type,
          chunk_name: chunk.name || "unnamed",
          code: codePart,
          description: description,
          start_line: chunk.start_line,
          end_line: chunk.end_line,
          total_lines: chunk.total_lines,
          file_size: chunk.file_size,
          embedding: embedding,
          metadata: JSON.stringify(metadata)
        };
        
        try {
          await this.table.add([record]);
          indexedCount++;
        } catch (error) {
          console.error(`Error indexing chunk ${chunkId}: ${error}`);
        }
      }
    }
    
    console.log(`Successfully indexed ${indexedCount} chunks`);
    return indexedCount;
  }

  /**
   * Search for similar code chunks using semantic search.
   * Returns a list of result objects with similarity scores.
   */
  async searchSimilar(query: string, limit: number = 10, threshold: number = 0.7): Promise<SearchResult[]> {
    const queryEmbedding = await this.getEmbedding(query);
    
    const results = await this.table
      .vectorSearch(queryEmbedding)
      .limit(limit)
      .toArray();
    
    const filteredResults: SearchResult[] = [];
    
    for (const row of results) {
      const similarity = this.cosineSimilarity(queryEmbedding, row.embedding);
      if (similarity >= threshold) {
        const result: SearchResult = {
          ...row,
          similarity: similarity
        };
        filteredResults.push(result);
      }
    }
    
    filteredResults.sort((a, b) => b.similarity - a.similarity);
    return filteredResults;
  }

  /**
   * Calculate cosine similarity between two vectors.
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      return 0.0;
    }
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);
    
    if (norm1 === 0 || norm2 === 0) {
      return 0.0;
    }
    
    return dotProduct / (norm1 * norm2);
  }

  /**
   * Search for code chunks containing specific keywords in code or chunk name.
   */
  async searchByKeyword(keyword: string, limit: number = 10): Promise<CodeRecord[]> {
    const results = await this.table
      .search(`code LIKE '%${keyword}%' OR chunk_name LIKE '%${keyword}%'`)
      .limit(limit)
      .toArray();
    
    return results;
  }

  /**
   * Get database statistics: total chunks, chunk type distribution, and file distribution.
   */
  async getStats(): Promise<Stats> {
    const allRecords = await this.table.toArray();
    const totalChunks = allRecords.length;
    
    const chunkTypes: Record<string, number> = {};
    const files: Record<string, number> = {};
    
    for (const record of allRecords) {
      // Count chunk types
      chunkTypes[record.chunk_type] = (chunkTypes[record.chunk_type] || 0) + 1;
      
      // Count files
      files[record.file_name] = (files[record.file_name] || 0) + 1;
    }
    
    return {
      total_chunks: totalChunks,
      chunk_types: chunkTypes,
      files: files
    };
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    // LanceDB connections are automatically managed
    // This method is provided for consistency with the Python version
  }
}
