# CodeIndexer TypeScript Implementation

This is a TypeScript port of the Python CodeIndexer class, designed for indexing and searching code chunks using embeddings and LanceDB.

## Features

- **Code Chunk Indexing**: Index code chunks with detailed metadata
- **Semantic Search**: Find similar code chunks using OpenAI embeddings
- **Keyword Search**: Search for code chunks by keywords
- **Text Splitting**: Automatically split large code chunks
- **Statistics**: Get insights about your indexed code

## Installation

### 1. Install Node.js Dependencies

```bash
# Install all required packages
npm install

# Or install manually:
npm install @lancedb/lancedb @langchain/openai langchain @types/node typescript
```

### 2. Set up Environment Variables

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

### 3. Build the TypeScript Code

```bash
npm run build
```

## Quick Start

```typescript
import { CodeIndexer, CodeChunk } from './dist/code-indexer';

async function example() {
  // Initialize indexer
  const indexer = new CodeIndexer("my_database", process.env.OPENAI_API_KEY);
  await indexer.initialize();

  // Prepare code chunks
  const chunks: CodeChunk[] = [
    {
      file_path: "src/utils/helper.ts",
      file_name: "helper.ts",
      type: "function",
      name: "formatDate",
      code: `export function formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
      }`,
      start_line: 1,
      end_line: 3,
      total_lines: 3,
      file_size: 100
    }
  ];

  // Index chunks
  await indexer.indexChunks(chunks);

  // Search similar code
  const results = await indexer.searchSimilar("date formatting function");
  console.log(results);

  // Search by keyword
  const keywordResults = await indexer.searchByKeyword("formatDate");
  console.log(keywordResults);

  // Get statistics
  const stats = await indexer.getStats();
  console.log(stats);
}
```

## API Reference

### Constructor

```typescript
new CodeIndexer(dbPath?: string, openaiApiKey?: string)
```

- `dbPath`: Path to LanceDB database (default: "code_database")
- `openaiApiKey`: OpenAI API key for embeddings

### Methods

#### `initialize(): Promise<void>`
Initialize the database connection. Must be called before using other methods.

#### `indexChunks(chunks: CodeChunk[]): Promise<number>`
Index an array of code chunks. Returns the number of successfully indexed chunks.

#### `searchSimilar(query: string, limit?: number, threshold?: number): Promise<SearchResult[]>`
Search for semantically similar code chunks.
- `query`: Search query
- `limit`: Maximum number of results (default: 10)
- `threshold`: Similarity threshold 0-1 (default: 0.7)

#### `searchByKeyword(keyword: string, limit?: number): Promise<CodeRecord[]>`
Search for code chunks containing specific keywords.

#### `getStats(): Promise<Stats>`
Get database statistics including total chunks, chunk types, and file distribution.

#### `close(): Promise<void>`
Close the database connection.

## Data Types

### CodeChunk
```typescript
interface CodeChunk {
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
```

### SearchResult
```typescript
interface SearchResult extends CodeRecord {
  similarity: number;
}
```

## Examples

### Indexing React Components

```typescript
const reactComponent: CodeChunk = {
  file_path: "src/components/Button/index.tsx",
  file_name: "index.tsx",
  type: "component",
  name: "Button",
  code: `export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
    return <button onClick={onClick}>{children}</button>;
  };`,
  start_line: 5,
  end_line: 7,
  total_lines: 20,
  file_size: 500,
  node_type: "react_component"
};

await indexer.indexChunks([reactComponent]);
```

### Searching for Similar Code

```typescript
// Find components similar to a button
const similar = await indexer.searchSimilar("clickable button component", 5, 0.6);

// Find utility functions
const utils = await indexer.searchSimilar("helper utility function", 10, 0.5);
```

### Getting Insights

```typescript
const stats = await indexer.getStats();
console.log(`Total indexed chunks: ${stats.total_chunks}`);
console.log(`Component types:`, stats.chunk_types);
console.log(`Files processed:`, stats.files);
```

## Differences from Python Version

1. **Async/Await**: All database operations are asynchronous
2. **Type Safety**: Full TypeScript type definitions
3. **Initialization**: Requires explicit `initialize()` call
4. **Error Handling**: TypeScript-style error handling
5. **Module System**: ES6 imports/exports

## Dependencies

- `@lancedb/lancedb`: Vector database for storing embeddings
- `@langchain/openai`: OpenAI embeddings integration
- `langchain`: Text splitting utilities
- `@types/node`: Node.js type definitions

## Troubleshooting

### Missing Dependencies
If you see import errors, install the required packages:
```bash
npm install @lancedb/lancedb @langchain/openai langchain
```

### OpenAI API Key
Make sure your OpenAI API key is set:
```bash
export OPENAI_API_KEY="sk-..."
```

### TypeScript Compilation
Build the project before using:
```bash
npm run build
```

## License

MIT License - see LICENSE file for details.
