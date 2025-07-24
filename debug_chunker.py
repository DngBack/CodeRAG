#!/usr/bin/env python3
"""
Debug script for tree-sitter chunker
"""

import os
import sys
from pathlib import Path
from tree_sitter_chunker import TreeSitterChunker


def test_single_file():
    """Test chunking a single file"""
    print("Testing single file chunking...")

    # Test with a known file
    test_file = "src/components/atoms/Button/index.tsx"

    if not Path(test_file).exists():
        print(f"Test file not found: {test_file}")
        return

    print(f"Testing file: {test_file}")

    # Read file content
    with open(test_file, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"File size: {len(content)} characters")
    print(f"File lines: {len(content.split(chr(10)))}")

    # Initialize chunker
    try:
        chunker = TreeSitterChunker()
        print("TreeSitterChunker initialized successfully")
    except Exception as e:
        print(f"Error initializing chunker: {e}")
        return

    # Parse file
    try:
        root_node = chunker.parse_file(test_file)
        if root_node:
            print(f"Parsing successful. Root node type: {root_node.type}")
            print(f"Number of children: {len(root_node.children)}")
        else:
            print("Parsing failed - root_node is None")
            return
    except Exception as e:
        print(f"Error parsing file: {e}")
        return

    # Extract chunks
    try:
        chunks = chunker.chunk_file(test_file)
        print(f"Found {len(chunks)} chunks:")

        for i, chunk in enumerate(chunks, 1):
            print(f"  {i}. Type: {chunk['type']}, Name: {chunk.get('name', 'unnamed')}")
            print(f"     Lines: {chunk['start_line']}-{chunk['end_line']}")
            print(f"     Code length: {len(chunk['code'])}")
            print(f"     Code preview: {chunk['code'][:100]}...")
            print()

    except Exception as e:
        print(f"Error chunking file: {e}")
        import traceback

        traceback.print_exc()


def test_directory():
    """Test chunking entire directory"""
    print("\nTesting directory chunking...")

    try:
        chunker = TreeSitterChunker()
        chunks = chunker.chunk_directory("src")

        print(f"Total chunks found: {len(chunks)}")

        # Group by file
        files_chunked = {}
        for chunk in chunks:
            file_path = chunk["file_path"]
            if file_path not in files_chunked:
                files_chunked[file_path] = []
            files_chunked[file_path].append(chunk)

        print(f"Files processed: {len(files_chunked)}")

        for file_path, file_chunks in files_chunked.items():
            print(f"  {file_path}: {len(file_chunks)} chunks")

    except Exception as e:
        print(f"Error in directory chunking: {e}")
        import traceback

        traceback.print_exc()


def main():
    """Main function"""
    print("Debug Tree-Sitter Chunker")
    print("=" * 40)

    # Check if build directory exists
    if not Path("build").exists():
        print("Build directory not found!")
        return

    if not Path("build/my-languages.so").exists():
        print("Tree-sitter grammar not found!")
        return

    print("Tree-sitter setup looks good")

    # Test single file
    test_single_file()

    # Test directory
    test_directory()


if __name__ == "__main__":
    main()
