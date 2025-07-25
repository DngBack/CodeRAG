import { SimpleTreeSitterChunker, CodeChunk } from './simple-tree-sitter-chunker';
import { CodeIndexer } from './code-indexer';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Complete example showing how to use SimpleTreeSitterChunker with CodeIndexer
 * for AI-powered code search and analysis
 */
async function integratedExample() {
  try {
    console.log("🚀 Starting Integrated Code RAG Example\n");

    // Step 1: Initialize both components
    console.log("=== Step 1: Initializing Components ===");
    const chunker = new SimpleTreeSitterChunker();
    const indexer = new CodeIndexer("integrated_code_db", process.env.OPENAI_API_KEY);
    
    // Initialize the indexer
    await indexer.initialize();
    console.log("✅ Components initialized successfully\n");

    // Step 2: Create some sample TypeScript files for demonstration
    console.log("=== Step 2: Creating Sample Code Files ===");
    await createSampleProjectStructure();
    console.log("✅ Sample project created\n");

    // Step 3: Chunk the code files
    console.log("=== Step 3: Chunking Code Files ===");
    const sampleDir = path.join(process.cwd(), 'sample-project');
    const chunks = await chunker.chunkDirectory(sampleDir);
    
    console.log(`Found ${chunks.length} code chunks:`);
    const stats = chunker.getChunkStats(chunks);
    console.log(`  - Functions: ${stats.functions}`);
    console.log(`  - Components: ${stats.components}`);
    console.log(`  - Imports: ${stats.imports}`);
    console.log(`  - Files processed: ${Object.keys(stats.files).length}\n`);

    // Step 4: Index the chunks for semantic search
    console.log("=== Step 4: Indexing Chunks for Semantic Search ===");
    
    // Convert chunks to the format expected by CodeIndexer
    const indexableChunks = chunks.map(chunk => ({
      file_path: chunk.file_path || '',
      file_name: chunk.file_name || '',
      type: chunk.type,
      name: chunk.name,
      code: chunk.code,
      start_line: chunk.start_line,
      end_line: chunk.end_line,
      total_lines: chunk.total_lines || 0,
      file_size: chunk.file_size || 0,
      node_type: chunk.node_type
    }));

    const indexedCount = await indexer.indexChunks(indexableChunks);
    console.log(`✅ Successfully indexed ${indexedCount} chunks\n`);

    // Step 5: Perform semantic searches
    console.log("=== Step 5: Semantic Code Search Examples ===");
    
    // Search for React components
    console.log("🔍 Searching for 'React button component':");
    const buttonResults = await indexer.searchSimilar("React button component", 3, 0.5);
    displaySearchResults(buttonResults);

    // Search for utility functions
    console.log("🔍 Searching for 'utility helper functions':");
    const utilResults = await indexer.searchSimilar("utility helper functions", 3, 0.5);
    displaySearchResults(utilResults);

    // Search for API-related code
    console.log("🔍 Searching for 'API service HTTP requests':");
    const apiResults = await indexer.searchSimilar("API service HTTP requests", 3, 0.5);
    displaySearchResults(apiResults);

    // Step 6: Keyword-based searches
    console.log("=== Step 6: Keyword-Based Search Examples ===");
    
    console.log("🔍 Searching for keyword 'useState':");
    const useStateResults = await indexer.searchByKeyword("useState", 5);
    displayKeywordResults(useStateResults);

    console.log("🔍 Searching for keyword 'interface':");
    const interfaceResults = await indexer.searchByKeyword("interface", 5);
    displayKeywordResults(interfaceResults);

    // Step 7: Advanced filtering and analysis
    console.log("=== Step 7: Advanced Analysis ===");
    
    // Filter by chunk types
    const componentChunks = chunker.filterChunksByType(chunks, 'component');
    const functionChunks = chunker.filterChunksByType(chunks, 'function');
    
    console.log(`Analysis by chunk type:`);
    console.log(`  - React Components: ${componentChunks.length}`);
    console.log(`  - Functions: ${functionChunks.length}`);
    
    // Show component details
    if (componentChunks.length > 0) {
      console.log(`\n📋 React Components found:`);
      componentChunks.forEach((chunk, index) => {
        console.log(`  ${index + 1}. ${chunk.name} in ${chunk.file_name} (${chunk.start_line}-${chunk.end_line} lines)`);
      });
    }

    // Step 8: Database statistics
    console.log("\n=== Step 8: Database Statistics ===");
    const dbStats = await indexer.getStats();
    console.log(`Total indexed chunks: ${dbStats.total_chunks}`);
    console.log(`Chunk type distribution:`, dbStats.chunk_types);
    console.log(`Files in database:`, Object.keys(dbStats.files).length);

    // Clean up
    await indexer.close();
    console.log("\n✅ Integrated example completed successfully!");
    console.log("\n💡 This demonstrates how to:");
    console.log("   - Parse TypeScript/TSX files into meaningful chunks");
    console.log("   - Index code chunks with semantic embeddings");
    console.log("   - Perform intelligent code search using natural language");
    console.log("   - Find relevant code snippets for AI code generation");

  } catch (error) {
    console.error("❌ Error in integrated example:", error);
  }
}

/**
 * Display semantic search results in a formatted way
 */
function displaySearchResults(results: any[]) {
  if (results.length === 0) {
    console.log("   No results found\n");
    return;
  }

  results.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.chunk_name || 'unnamed'} (${result.chunk_type})`);
    console.log(`      File: ${result.file_name}`);
    console.log(`      Similarity: ${(result.similarity * 100).toFixed(1)}%`);
    console.log(`      Lines: ${result.start_line}-${result.end_line}`);
    console.log(`      Preview: ${result.code.substring(0, 80).replace(/\n/g, ' ')}...`);
    console.log();
  });
}

/**
 * Display keyword search results in a formatted way
 */
function displayKeywordResults(results: any[]) {
  if (results.length === 0) {
    console.log("   No results found\n");
    return;
  }

  results.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.chunk_name || 'unnamed'} (${result.chunk_type})`);
    console.log(`      File: ${result.file_name}`);
    console.log(`      Lines: ${result.start_line}-${result.end_line}`);
  });
  console.log();
}

/**
 * Create a sample project structure for demonstration
 */
async function createSampleProjectStructure() {
  const projectDir = path.join(process.cwd(), 'sample-project');
  
  // Create directories
  await fs.mkdir(path.join(projectDir, 'components'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'utils'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'services'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'hooks'), { recursive: true });

  // Sample React Button component
  const buttonComponent = `import React, { useState } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <button
      className={\`btn btn-\${variant} btn-\${size} \${disabled ? 'btn-disabled' : ''} \${loading ? 'btn-loading' : ''} \${isPressed ? 'btn-pressed' : ''}\`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;`;

  // Sample utility functions
  const utilityFunctions = `import { format, isValid, parseISO } from 'date-fns';

export function formatDate(date: Date | string, formatString: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid Date';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}`;

  // Sample API service
  const apiService = `interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = \`Bearer \${token}\`;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const headers = { ...this.defaultHeaders, ...config?.headers };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: config?.timeout ? AbortSignal.timeout(config.timeout) : undefined,
      });

      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw new Error(\`API request failed: \${error}\`);
    }
  }
}

export default ApiService;`;

  // Sample custom hook
  const customHook = `import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string, dependencies: any[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}`;

  // Write the files
  await fs.writeFile(path.join(projectDir, 'components', 'Button.tsx'), buttonComponent);
  await fs.writeFile(path.join(projectDir, 'utils', 'helpers.ts'), utilityFunctions);
  await fs.writeFile(path.join(projectDir, 'services', 'ApiService.ts'), apiService);
  await fs.writeFile(path.join(projectDir, 'hooks', 'useApi.ts'), customHook);

  console.log(`📁 Created sample project in ${projectDir}`);
}

// Run the integrated example
if (require.main === module) {
  integratedExample().catch(console.error);
}

export { integratedExample };
