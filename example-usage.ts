import { CodeIndexer, CodeChunk } from './code-indexer';

/**
 * Example usage of the TypeScript CodeIndexer
 */
async function main() {
  try {
    // Initialize the CodeIndexer
    const indexer = new CodeIndexer("my_code_database", process.env.OPENAI_API_KEY);
    await indexer.initialize();

    // Example code chunks to index
    const chunks: CodeChunk[] = [
      {
        file_path: "src/components/Button/index.tsx",
        file_name: "index.tsx",
        type: "function",
        name: "Button",
        code: `interface ButtonProps {
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
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};`,
        start_line: 1,
        end_line: 20,
        total_lines: 20,
        file_size: 500,
        node_type: "component"
      },
      {
        file_path: "src/components/TextField/index.tsx",
        file_name: "index.tsx",
        type: "function",
        name: "TextField",
        code: `interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'password' | 'email';
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text'
}) => {
  return (
    <div className="text-field">
      {label && <label className="text-field__label">{label}</label>}
      <input
        type={type}
        className={\`text-field__input \${error ? 'text-field__input--error' : ''}\`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-field__error">{error}</span>}
    </div>
  );
};`,
        start_line: 1,
        end_line: 28,
        total_lines: 28,
        file_size: 700,
        node_type: "component"
      }
    ];

    // Index the chunks
    console.log("\n=== Indexing Code Chunks ===");
    const indexedCount = await indexer.indexChunks(chunks);
    console.log(`Indexed ${indexedCount} chunks successfully!`);

    // Perform semantic search
    console.log("\n=== Semantic Search ===");
    const searchResults = await indexer.searchSimilar("React button component with click handler", 5, 0.6);
    console.log(`Found ${searchResults.length} similar chunks:`);
    
    searchResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.chunk_name} (${result.chunk_type})`);
      console.log(`   File: ${result.file_path}`);
      console.log(`   Similarity: ${(result.similarity * 100).toFixed(2)}%`);
      console.log(`   Description: ${result.description.substring(0, 100)}...`);
    });

    // Perform keyword search
    console.log("\n=== Keyword Search ===");
    const keywordResults = await indexer.searchByKeyword("TextField", 5);
    console.log(`Found ${keywordResults.length} chunks with keyword 'TextField':`);
    
    keywordResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.chunk_name} (${result.chunk_type})`);
      console.log(`   File: ${result.file_path}`);
      console.log(`   Lines: ${result.start_line}-${result.end_line}`);
    });

    // Get database statistics
    console.log("\n=== Database Statistics ===");
    const stats = await indexer.getStats();
    console.log(`Total chunks: ${stats.total_chunks}`);
    console.log(`Chunk types:`, stats.chunk_types);
    console.log(`Files:`, stats.files);

    // Clean up
    await indexer.close();
    console.log("\n✅ Example completed successfully!");

  } catch (error) {
    console.error("❌ Error running example:", error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as runExample };
