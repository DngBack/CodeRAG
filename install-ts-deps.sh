#!/bin/bash

# Install TypeScript dependencies for CodeIndexer
echo "Installing TypeScript dependencies for CodeIndexer..."

# Install Node.js dependencies
npm install

echo "Dependencies installed successfully!"
echo ""
echo "To use the CodeIndexer:"
echo "1. Make sure you have Node.js installed"
echo "2. Set your OPENAI_API_KEY environment variable"
echo "3. Run 'npm run build' to compile TypeScript"
echo "4. Import and use the CodeIndexer class in your TypeScript/JavaScript code"
echo ""
echo "Example usage:"
echo "import { CodeIndexer } from './dist/code-indexer';"
echo ""
echo "const indexer = new CodeIndexer('my_database', 'your-openai-api-key');"
echo "await indexer.initialize();"
echo "await indexer.indexChunks(chunks);"
echo "const results = await indexer.searchSimilar('search query');"
