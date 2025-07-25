import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { glob } from 'glob';

const readFile = promisify(fs.readFile);

// Type definitions
export interface ParsedFile {
  content: string;
  lines: string[];
}

export interface CodeChunk {
  type: string;
  name?: string;
  code: string;
  start_line: number;
  end_line: number;
  node_type?: string;
  file_path?: string;
  file_name?: string;
  total_lines?: number;
  file_size?: number;
}

export interface FileInfo {
  file_path: string;
  file_name: string;
  total_lines: number;
  file_size: number;
}

/**
 * SimpleTreeSitterChunker - A TypeScript implementation for parsing and chunking
 * TypeScript/TSX files using regex patterns without tree-sitter grammar.
 */
export class SimpleTreeSitterChunker {
  constructor() {
    // Initialize simple chunker without tree-sitter grammar
  }

  /**
   * Parse a TSX/TS file by reading its content and splitting into lines
   */
  async parseFile(filePath: string): Promise<ParsedFile | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return {
        content,
        lines: content.split('\n')
      };
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract function declarations using regex patterns
   */
  extractFunctions(parsedFile: ParsedFile, sourceCode: string): CodeChunk[] {
    const functions: CodeChunk[] = [];
    const lines = parsedFile.lines;

    // Patterns for different function types
    const patterns = [
      // Function declaration: function name() { ... }
      /function\s+(\w+)\s*\([^)]*\)\s*\{/,
      // Arrow function: const name = () => { ... }
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{/,
      // Arrow function: const name = () => ( ... )
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\(/,
      // Method definition: name() { ... }
      /(\w+)\s*\([^)]*\)\s*\{/,
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const functionName = match[1];

          // Find function body (simplified)
          const startLine = i;
          const endLine = this.findFunctionEnd(lines, i);

          const functionCode = lines.slice(startLine, endLine + 1).join('\n');

          functions.push({
            type: 'function',
            name: functionName,
            code: functionCode,
            start_line: startLine,
            end_line: endLine,
            node_type: 'function_declaration',
          });
          break;
        }
      }
    }

    return functions;
  }

  /**
   * Extract React components using regex patterns
   */
  extractComponents(parsedFile: ParsedFile, sourceCode: string): CodeChunk[] {
    const components: CodeChunk[] = [];
    const lines = parsedFile.lines;

    // Patterns for React components
    const patterns = [
      // const Component = () => { ... }
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{/,
      // const Component = () => ( ... )
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\(/,
      // export default function Component() { ... }
      /export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*\{/,
      // function Component() { ... }
      /function\s+(\w+)\s*\([^)]*\)\s*\{/,
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const componentName = match[1];

          // Find component body
          const startLine = i;
          const endLine = this.findFunctionEnd(lines, i);

          const componentCode = lines.slice(startLine, endLine + 1).join('\n');

          components.push({
            type: 'component',
            name: componentName,
            code: componentCode,
            start_line: startLine,
            end_line: endLine,
            node_type: 'component',
          });
          break;
        }
      }
    }

    return components;
  }

  /**
   * Extract import statements using regex patterns
   */
  extractImports(parsedFile: ParsedFile, sourceCode: string): CodeChunk[] {
    const imports: CodeChunk[] = [];
    const lines = parsedFile.lines;

    const importPattern = /^import\s+.*$/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (importPattern.test(line.trim())) {
        imports.push({
          type: 'import',
          code: line.trim(),
          start_line: i,
          end_line: i,
        });
      }
    }

    return imports;
  }

  /**
   * Find the end of a function/component by counting braces (simplified approach)
   */
  private findFunctionEnd(lines: string[], startLine: number): number {
    let braceCount = 0;
    let inFunction = false;

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i];

      // Count braces
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;

      if (!inFunction && line.includes('{')) {
        inFunction = true;
      }

      if (inFunction && braceCount === 0) {
        return i;
      }
    }

    return lines.length - 1;
  }

  /**
   * Chunk a TSX/TS file into meaningful code segments
   */
  async chunkFile(filePath: string): Promise<CodeChunk[]> {
    const parsedFile = await this.parseFile(filePath);
    if (!parsedFile) {
      return [];
    }

    const sourceCode = parsedFile.content;
    const chunks: CodeChunk[] = [];

    // Extract different types of code segments
    const functions = this.extractFunctions(parsedFile, sourceCode);
    const components = this.extractComponents(parsedFile, sourceCode);
    const imports = this.extractImports(parsedFile, sourceCode);

    // Add file-level metadata
    const fileInfo: FileInfo = {
      file_path: filePath,
      file_name: path.basename(filePath),
      total_lines: sourceCode.split('\n').length,
      file_size: sourceCode.length,
    };

    // Combine all chunks with file info
    const allChunks = [...functions, ...components, ...imports];
    for (const chunk of allChunks) {
      Object.assign(chunk, fileInfo);
      chunks.push(chunk);
    }

    return chunks;
  }

  /**
   * Chunk all TSX/TS files in a directory recursively
   */
  async chunkDirectory(directoryPath: string): Promise<CodeChunk[]> {
    const allChunks: CodeChunk[] = [];

    try {
      // Find all TSX and TS files using glob
      const tsxFiles = await glob('**/*.tsx', { cwd: directoryPath, absolute: true });
      const tsFiles = await glob('**/*.ts', { cwd: directoryPath, absolute: true });

      const allFiles = [...tsxFiles, ...tsFiles];

      // Process each file
      for (const filePath of allFiles) {
        console.log(`Chunking ${filePath}...`);
        const chunks = await this.chunkFile(filePath);
        allChunks.push(...chunks);
      }

      return allChunks;
    } catch (error) {
      console.error(`Error chunking directory ${directoryPath}:`, error);
      return [];
    }
  }

  /**
   * Chunk multiple files provided as an array of file paths
   */
  async chunkFiles(filePaths: string[]): Promise<CodeChunk[]> {
    const allChunks: CodeChunk[] = [];

    for (const filePath of filePaths) {
      try {
        console.log(`Chunking ${filePath}...`);
        const chunks = await this.chunkFile(filePath);
        allChunks.push(...chunks);
      } catch (error) {
        console.error(`Error chunking file ${filePath}:`, error);
      }
    }

    return allChunks;
  }

  /**
   * Get statistics about the chunked code
   */
  getChunkStats(chunks: CodeChunk[]): {
    total_chunks: number;
    chunk_types: Record<string, number>;
    files: Record<string, number>;
    functions: number;
    components: number;
    imports: number;
  } {
    const stats = {
      total_chunks: chunks.length,
      chunk_types: {} as Record<string, number>,
      files: {} as Record<string, number>,
      functions: 0,
      components: 0,
      imports: 0,
    };

    for (const chunk of chunks) {
      // Count chunk types
      stats.chunk_types[chunk.type] = (stats.chunk_types[chunk.type] || 0) + 1;

      // Count files
      if (chunk.file_name) {
        stats.files[chunk.file_name] = (stats.files[chunk.file_name] || 0) + 1;
      }

      // Count specific types
      if (chunk.type === 'function') stats.functions++;
      if (chunk.type === 'component') stats.components++;
      if (chunk.type === 'import') stats.imports++;
    }

    return stats;
  }

  /**
   * Filter chunks by type
   */
  filterChunksByType(chunks: CodeChunk[], type: string): CodeChunk[] {
    return chunks.filter(chunk => chunk.type === type);
  }

  /**
   * Filter chunks by file extension
   */
  filterChunksByExtension(chunks: CodeChunk[], extension: string): CodeChunk[] {
    return chunks.filter(chunk => 
      chunk.file_name && chunk.file_name.endsWith(extension)
    );
  }

  /**
   * Get chunks from a specific file
   */
  getChunksFromFile(chunks: CodeChunk[], filePath: string): CodeChunk[] {
    return chunks.filter(chunk => chunk.file_path === filePath);
  }
}
