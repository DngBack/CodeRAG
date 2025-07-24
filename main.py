#!/usr/bin/env python3
"""
Main script for code indexing and semantic search using tree-sitter and LanceDB
"""

import os
import sys
from pathlib import Path
from simple_tree_sitter_chunker import SimpleTreeSitterChunker as TreeSitterChunker
from code_indexer import CodeIndexer
import json


def setup_environment():
    """Setup environment and check dependencies"""
    print("Setting up environment...")
    return True


def index_codebase(src_path: str = "src", openai_api_key: str = None):
    """Index the entire codebase"""
    print(f"Starting codebase indexing from {src_path}...")

    # Initialize chunker and indexer
    chunker = TreeSitterChunker()
    indexer = CodeIndexer(openai_api_key=openai_api_key)

    # Chunk all files
    print("Chunking code files...")

    # Debug: Check what files are found
    import glob

    tsx_files = glob.glob(f"{src_path}/**/*.tsx", recursive=True)
    ts_files = glob.glob(f"{src_path}/**/*.ts", recursive=True)
    all_files = tsx_files + ts_files
    print(f"Found {len(all_files)} TSX/TS files:")
    for f in all_files[:5]:  # Show first 5 files
        print(f"  - {f}")
    if len(all_files) > 5:
        print(f"  ... and {len(all_files) - 5} more files")

    chunks = chunker.chunk_directory(src_path)
    print(f"Chunks found: {len(chunks)}")
    if chunks:
        print("First chunk details:")
        print(f"  Type: {chunks[0]['type']}")
        print(f"  Name: {chunks[0].get('name', 'unnamed')}")
        print(f"  File: {chunks[0]['file_path']}")
        print(f"  Lines: {chunks[0]['start_line']}-{chunks[0]['end_line']}")
        print(f"  Code preview: {chunks[0]['code'][:100]}...")

    if not chunks:
        print("No chunks found. Check if the source directory contains TSX/TS files.")
        return

    print(f"Found {len(chunks)} chunks")

    # Index chunks
    print("Indexing chunks into LanceDB...")
    indexed_count = indexer.index_chunks(chunks)

    print(f"Indexing completed! Indexed {indexed_count} chunks")

    # Show statistics
    stats = indexer.get_stats()
    print("\nDatabase Statistics:")
    print(f"Total chunks: {stats['total_chunks']}")
    print(f"Chunk types: {stats['chunk_types']}")
    print(f"Files indexed: {len(stats['files'])}")


def search_code(query: str, limit: int = 10, threshold: float = 0.7):
    """Search for code using semantic search"""
    print(f"Searching for: '{query}'")

    # Initialize indexer
    indexer = CodeIndexer()

    # Perform semantic search
    results = indexer.search_similar(query, limit=limit, threshold=threshold)

    if not results:
        print("No results found.")
        return

    print(f"\nFound {len(results)} results:")
    print("=" * 80)

    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result['chunk_name']} ({result['chunk_type']})")
        print(f"   File: {result['file_name']}")
        print(f"   Lines: {result['start_line']}-{result['end_line']}")
        print(f"   Similarity: {result['similarity']:.3f}")
        print(f"   Code preview:")

        # Show first few lines of code
        code_lines = result["code"].split("\n")[:5]
        for line in code_lines:
            print(f"   {line}")

        if len(result["code"].split("\n")) > 5:
            print("   ...")

        print("-" * 40)


def interactive_search():
    """Interactive search mode"""
    print("Interactive Code Search Mode")
    print("Type 'quit' to exit")
    print("-" * 40)

    indexer = CodeIndexer()

    while True:
        try:
            query = input("\nEnter search query: ").strip()

            if query.lower() == "quit":
                break

            if not query:
                continue

            search_code(query)

        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {e}")


def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python main.py index [src_path] [openai_api_key]")
        print("  python main.py search <query>")
        print("  python main.py interactive")
        return

    command = sys.argv[1]

    if command == "index":
        src_path = sys.argv[2] if len(sys.argv) > 2 else "src"
        openai_api_key = sys.argv[3] if len(sys.argv) > 3 else None

        # if not setup_environment():
        #     return

        index_codebase(src_path, openai_api_key)

    elif command == "search":
        if len(sys.argv) < 3:
            print("Please provide a search query")
            return

        query = sys.argv[2]
        search_code(query)

    elif command == "interactive":
        if not setup_environment():
            return

        interactive_search()

    else:
        print(f"Unknown command: {command}")


if __name__ == "__main__":
    main()
