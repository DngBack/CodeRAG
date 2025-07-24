#!/usr/bin/env python3
"""
Test script for semantic search demo
"""

import os
import sys
from pathlib import Path
from tree_sitter_chunker import TreeSitterChunker
from code_indexer import CodeIndexer


def demo_search():
    """Demo semantic search functionality"""

    print("Demo: Code Semantic Search with Tree-Sitter and LanceDB")
    print("=" * 60)

    # Check if database exists
    if not Path("code_database").exists():
        print("Database chua duoc tao. Hay chay indexing truoc:")
        print("   python main.py index")
        return

    # Initialize indexer
    try:
        indexer = CodeIndexer()
        print("Ket noi database thanh cong")
    except Exception as e:
        print(f"Loi ket noi database: {e}")
        return

    # Get database stats
    stats = indexer.get_stats()
    print(f"Database co {stats['total_chunks']} chunks")
    print(f"Files indexed: {len(stats['files'])}")
    print(f"Chunk types: {stats['chunk_types']}")
    print()

    # Test search queries
    test_queries = [
        "Implement header",
        "navigation bar component",
        "button implementation",
        "form validation",
        "authentication logic",
    ]

    for query in test_queries:
        print(f"Tim kiem: '{query}'")
        print("-" * 40)

        try:
            results = indexer.search_similar(query, limit=3, threshold=0.6)

            if results:
                for i, result in enumerate(results, 1):
                    print(f"{i}. {result['chunk_name']} ({result['chunk_type']})")
                    print(f"   File: {result['file_name']}")
                    print(f"   Lines: {result['start_line']}-{result['end_line']}")
                    print(f"   Similarity: {result['similarity']:.3f}")

                    # Show code preview
                    code_preview = (
                        result["code"][:200] + "..."
                        if len(result["code"]) > 200
                        else result["code"]
                    )
                    print(f"   Code: {code_preview}")
                    print()
            else:
                print("   Khong tim thay ket qua")
                print()

        except Exception as e:
            print(f"   Loi tim kiem: {e}")
            print()

    print("Demo hoan thanh!")


def demo_indexing():
    """Demo indexing functionality"""

    print("Demo: Indexing Codebase")
    print("=" * 40)

    # Check if tree-sitter is setup
    if not Path("build/my-languages.so").exists():
        print("Tree-sitter grammar chua duoc setup. Chay:")
        print("   python setup_tree_sitter.py")
        return

    # Initialize chunker
    try:
        chunker = TreeSitterChunker()
        print("Tree-sitter chunker initialized")
    except Exception as e:
        print(f"Loi khoi tao chunker: {e}")
        return

    # Chunk a sample file
    sample_file = "src/components/atoms/Button/index.tsx"
    if Path(sample_file).exists():
        print(f"Chunking file: {sample_file}")
        chunks = chunker.chunk_file(sample_file)

        print(f"Tim thay {len(chunks)} chunks:")
        for i, chunk in enumerate(chunks, 1):
            print(f"   {i}. {chunk['type']}: {chunk.get('name', 'unnamed')}")
            print(f"      Lines: {chunk['start_line']}-{chunk['end_line']}")
    else:
        print(f"File mau khong ton tai: {sample_file}")

    print("Demo indexing hoan thanh!")


def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python test_search.py search  # Demo search")
        print("  python test_search.py index   # Demo indexing")
        return

    command = sys.argv[1]

    if command == "search":
        demo_search()
    elif command == "index":
        demo_indexing()
    else:
        print(f"Unknown command: {command}")


if __name__ == "__main__":
    main()
