import { SimpleTreeSitterChunker, CodeChunk } from './simple-tree-sitter-chunker';
import * as path from 'path';

/**
 * Example usage of the TypeScript SimpleTreeSitterChunker
 */
async function main() {
  try {
    // Initialize the chunker
    const chunker = new SimpleTreeSitterChunker();

    console.log("🚀 Starting TypeScript/TSX Code Chunking Example\n");

    // Example 1: Chunk a single file
    console.log("=== Example 1: Chunking a Single File ===");
    const singleFilePath = path.join(__dirname, 'src/components/Button/index.tsx');
    
    // Check if the file exists, if not use the current directory
    const testFilePath = path.join(__dirname, 'simple-tree-sitter-chunker.ts');
    
    console.log(`Chunking file: ${testFilePath}`);
    const singleFileChunks = await chunker.chunkFile(testFilePath);
    
    console.log(`Found ${singleFileChunks.length} chunks in the file:`);
    singleFileChunks.forEach((chunk, index) => {
      console.log(`  ${index + 1}. ${chunk.type}: ${chunk.name || 'unnamed'} (lines ${chunk.start_line}-${chunk.end_line})`);
    });

    // Example 2: Chunk a directory
    console.log("\n=== Example 2: Chunking a Directory ===");
    const srcDirectory = path.join(__dirname, 'src');
    
    // Use current directory if src doesn't exist
    const targetDirectory = path.join(__dirname);
    
    console.log(`Chunking directory: ${targetDirectory}`);
    const directoryChunks = await chunker.chunkDirectory(targetDirectory);
    
    console.log(`Found ${directoryChunks.length} total chunks in the directory`);

    // Example 3: Get statistics
    console.log("\n=== Example 3: Analyzing Chunk Statistics ===");
    const stats = chunker.getChunkStats(directoryChunks);
    
    console.log(`Total chunks: ${stats.total_chunks}`);
    console.log(`Functions: ${stats.functions}`);
    console.log(`Components: ${stats.components}`);
    console.log(`Imports: ${stats.imports}`);
    console.log('Chunk types:', stats.chunk_types);
    console.log('Files processed:', Object.keys(stats.files).length);

    // Example 4: Filter chunks by type
    console.log("\n=== Example 4: Filtering Chunks ===");
    const functionChunks = chunker.filterChunksByType(directoryChunks, 'function');
    const componentChunks = chunker.filterChunksByType(directoryChunks, 'component');
    const importChunks = chunker.filterChunksByType(directoryChunks, 'import');

    console.log(`Function chunks: ${functionChunks.length}`);
    if (functionChunks.length > 0) {
      console.log('Functions found:');
      functionChunks.slice(0, 5).forEach((chunk, index) => {
        console.log(`  ${index + 1}. ${chunk.name} in ${chunk.file_name} (${chunk.start_line}-${chunk.end_line})`);
      });
    }

    console.log(`Component chunks: ${componentChunks.length}`);
    if (componentChunks.length > 0) {
      console.log('Components found:');
      componentChunks.slice(0, 5).forEach((chunk, index) => {
        console.log(`  ${index + 1}. ${chunk.name} in ${chunk.file_name} (${chunk.start_line}-${chunk.end_line})`);
      });
    }

    // Example 5: Filter by file extension
    console.log("\n=== Example 5: Filtering by File Extension ===");
    const tsChunks = chunker.filterChunksByExtension(directoryChunks, '.ts');
    const tsxChunks = chunker.filterChunksByExtension(directoryChunks, '.tsx');
    
    console.log(`TypeScript (.ts) chunks: ${tsChunks.length}`);
    console.log(`TSX (.tsx) chunks: ${tsxChunks.length}`);

    // Example 6: Show detailed chunk information
    console.log("\n=== Example 6: Detailed Chunk Information ===");
    if (functionChunks.length > 0) {
      const firstFunction = functionChunks[0];
      console.log(`Sample Function Chunk:`);
      console.log(`  Name: ${firstFunction.name}`);
      console.log(`  Type: ${firstFunction.type}`);
      console.log(`  File: ${firstFunction.file_name}`);
      console.log(`  Lines: ${firstFunction.start_line}-${firstFunction.end_line}`);
      console.log(`  Code preview:`);
      console.log(`    ${firstFunction.code.split('\n')[0]}...`);
    }

    // Example 7: Chunk specific files
    console.log("\n=== Example 7: Chunking Specific Files ===");
    const specificFiles = [
      path.join(__dirname, 'simple-tree-sitter-chunker.ts'),
      path.join(__dirname, 'code-indexer.ts')
    ].filter(file => {
      try {
        require('fs').statSync(file);
        return true;
      } catch {
        return false;
      }
    });

    if (specificFiles.length > 0) {
      const specificChunks = await chunker.chunkFiles(specificFiles);
      console.log(`Chunked ${specificFiles.length} specific files, found ${specificChunks.length} chunks`);
      
      const specificStats = chunker.getChunkStats(specificChunks);
      console.log('Specific files stats:', specificStats.chunk_types);
    }

    console.log("\n✅ TypeScript Code Chunking Example completed successfully!");

  } catch (error) {
    console.error("❌ Error running chunker example:", error);
  }
}

// Demo function for creating sample TypeScript files to test
async function createSampleFiles() {
  const fs = require('fs').promises;
  const path = require('path');

  const sampleDir = path.join(__dirname, 'sample-code');
  
  try {
    await fs.mkdir(sampleDir, { recursive: true });

    // Sample React component
    const sampleComponent = `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <button
      className={\`btn btn-\${variant} \${disabled ? 'btn-disabled' : ''}\`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`;

    // Sample utility functions
    const sampleUtils = `export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export default ApiService;`;

    await fs.writeFile(path.join(sampleDir, 'Button.tsx'), sampleComponent);
    await fs.writeFile(path.join(sampleDir, 'utils.ts'), sampleUtils);

    console.log(`📁 Created sample files in ${sampleDir}`);
    return sampleDir;
  } catch (error) {
    console.error('Error creating sample files:', error);
    return null;
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as runChunkerExample, createSampleFiles };
