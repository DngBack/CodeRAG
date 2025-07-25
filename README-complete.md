# CodeRAG TypeScript Implementation

A complete TypeScript implementation of Code Retrieval-Augmented Generation (RAG) system for AI-powered code analysis and search.

## 🚀 Features

### SimpleTreeSitterChunker
- **Code Parsing**: Parse TypeScript/TSX files using regex patterns
- **Intelligent Chunking**: Extract functions, React components, and imports
- **Directory Processing**: Recursively process entire codebases
- **Flexible Filtering**: Filter chunks by type, file extension, or file path
- **Statistics & Analysis**: Get insights about your codebase structure

### CodeIndexer
- **Semantic Search**: Find similar code using OpenAI embeddings
- **Vector Database**: Store and search code chunks in LanceDB
- **Keyword Search**: Traditional text-based search capabilities
- **Detailed Descriptions**: Generate rich descriptions for better search accuracy
- **Code Splitting**: Automatically handle large code chunks

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @lancedb/lancedb @langchain/openai langchain glob @types/node typescript
```

### 2. Environment Setup

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

### 3. Build TypeScript

```bash
npx tsc
```

## 🛠️ Quick Start

### Basic Code Chunking

```typescript
import { SimpleTreeSitterChunker } from './simple-tree-sitter-chunker';

const chunker = new SimpleTreeSitterChunker();

// Chunk a single file
const chunks = await chunker.chunkFile('src/components/Button.tsx');

// Chunk entire directory
const allChunks = await chunker.chunkDirectory('src/');

// Get statistics
const stats = chunker.getChunkStats(allChunks);
console.log(`Found ${stats.functions} functions and ${stats.components} components`);
```

### Semantic Code Search

```typescript
import { CodeIndexer } from './code-indexer';

const indexer = new CodeIndexer("my_database", process.env.OPENAI_API_KEY);
await indexer.initialize();

// Index your code chunks
await indexer.indexChunks(chunks);

// Search for similar code
const results = await indexer.searchSimilar("React button component with click handler");

// Keyword search
const keywordResults = await indexer.searchByKeyword("useState");
```

### Complete Integration Example

```typescript
import { SimpleTreeSitterChunker } from './simple-tree-sitter-chunker';
import { CodeIndexer } from './code-indexer';

async function codeRAGExample() {
  // Step 1: Parse and chunk your codebase
  const chunker = new SimpleTreeSitterChunker();
  const codeChunks = await chunker.chunkDirectory('src/');
  
  // Step 2: Index chunks for semantic search
  const indexer = new CodeIndexer();
  await indexer.initialize();
  await indexer.indexChunks(codeChunks);
  
  // Step 3: Perform intelligent code search
  const results = await indexer.searchSimilar(
    "utility function for date formatting", 
    5, 
    0.7
  );
  
  console.log('Found relevant code snippets:', results);
}
```

## 📚 API Reference

### SimpleTreeSitterChunker

#### Methods

```typescript
// Parse a single file
parseFile(filePath: string): Promise<ParsedFile | null>

// Extract functions from parsed content
extractFunctions(parsedFile: ParsedFile, sourceCode: string): CodeChunk[]

// Extract React components
extractComponents(parsedFile: ParsedFile, sourceCode: string): CodeChunk[]

// Extract import statements
extractImports(parsedFile: ParsedFile, sourceCode: string): CodeChunk[]

// Chunk a single file
chunkFile(filePath: string): Promise<CodeChunk[]>

// Chunk entire directory
chunkDirectory(directoryPath: string): Promise<CodeChunk[]>

// Chunk specific files
chunkFiles(filePaths: string[]): Promise<CodeChunk[]>

// Get statistics about chunks
getChunkStats(chunks: CodeChunk[]): ChunkStats

// Filter chunks by various criteria
filterChunksByType(chunks: CodeChunk[], type: string): CodeChunk[]
filterChunksByExtension(chunks: CodeChunk[], extension: string): CodeChunk[]
getChunksFromFile(chunks: CodeChunk[], filePath: string): CodeChunk[]
```

### CodeIndexer

#### Methods

```typescript
// Initialize database connection
initialize(): Promise<void>

// Index code chunks
indexChunks(chunks: CodeChunk[]): Promise<number>

// Semantic search
searchSimilar(query: string, limit?: number, threshold?: number): Promise<SearchResult[]>

// Keyword search
searchByKeyword(keyword: string, limit?: number): Promise<CodeRecord[]>

// Get database statistics
getStats(): Promise<Stats>

// Close connection
close(): Promise<void>
```

## 🏗️ Data Types

### CodeChunk
```typescript
interface CodeChunk {
  type: string;           // 'function' | 'component' | 'import'
  name?: string;          // Name of the function/component
  code: string;           // Source code
  start_line: number;     // Starting line number
  end_line: number;       // Ending line number
  node_type?: string;     // AST node type
  file_path?: string;     // Full file path
  file_name?: string;     // File name only
  total_lines?: number;   // Total lines in file
  file_size?: number;     // File size in bytes
}
```

### SearchResult
```typescript
interface SearchResult extends CodeRecord {
  similarity: number;     // Cosine similarity score (0-1)
}
```

## 💡 Use Cases

### AI Code Generation
```typescript
// Find similar implementations for AI to learn from
const similarCode = await indexer.searchSimilar(
  "authentication middleware with JWT validation",
  10,
  0.6
);

// Use the results to generate new code or provide examples
```

### Code Documentation
```typescript
// Find all functions in a codebase
const functions = chunker.filterChunksByType(chunks, 'function');

// Generate documentation based on code patterns
```

### Refactoring Assistant
```typescript
// Find all components that use a specific pattern
const components = await indexer.searchByKeyword("useState");

// Identify refactoring opportunities
```

### Code Review
```typescript
// Find similar code patterns to ensure consistency
const patterns = await indexer.searchSimilar("error handling pattern", 20);
```

## 🔧 Advanced Configuration

### Custom Chunk Processing
```typescript
const chunker = new SimpleTreeSitterChunker();

// Process chunks with custom logic
const processChunk = (chunk: CodeChunk) => {
  // Add custom metadata
  chunk.complexity = calculateComplexity(chunk.code);
  chunk.dependencies = extractDependencies(chunk.code);
  return chunk;
};

const chunks = await chunker.chunkDirectory('src/');
const processedChunks = chunks.map(processChunk);
```

### Advanced Search Patterns
```typescript
// Multi-step search for complex queries
const step1 = await indexer.searchSimilar("React hook", 50, 0.5);
const step2 = step1.filter(result => result.code.includes('useEffect'));
const step3 = await indexer.searchSimilar("cleanup function", 10, 0.7);
```

## 📊 Performance Considerations

- **Chunking**: Process files in batches for large codebases
- **Indexing**: Use appropriate chunk sizes (default: 1000 chars)
- **Search**: Adjust similarity thresholds based on use case
- **Memory**: Monitor memory usage with large vector databases

## 🧪 Testing

```typescript
// Example test structure
describe('SimpleTreeSitterChunker', () => {
  it('should extract React components correctly', async () => {
    const chunker = new SimpleTreeSitterChunker();
    const chunks = await chunker.chunkFile('test-component.tsx');
    const components = chunker.filterChunksByType(chunks, 'component');
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe('TestComponent');
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Missing Node.js Types**
   ```bash
   npm install @types/node
   ```

2. **OpenAI API Key Not Set**
   ```bash
   export OPENAI_API_KEY="sk-..."
   ```

3. **TypeScript Compilation Errors**
   ```bash
   npx tsc --noEmit  # Check for errors
   ```

4. **LanceDB Connection Issues**
   - Ensure write permissions to database directory
   - Check available disk space

### Performance Optimization

- Use `.gitignore` patterns to exclude unnecessary files
- Implement chunk caching for frequently accessed files
- Consider batch processing for large codebases
- Monitor embeddings API usage and costs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Projects

- [LangChain](https://github.com/hwchase17/langchain) - Framework for LLM applications
- [LanceDB](https://github.com/lancedb/lancedb) - Vector database for AI applications
- [Tree-sitter](https://tree-sitter.github.io/) - Parser generator for syntax trees

---

**Ready to supercharge your AI code generation with intelligent code search!** 🚀
