#!/usr/bin/env python3
"""
Complete demo pipeline for code semantic search
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}")
    print(f"   Running: {command}")

    try:
        result = subprocess.run(
            command, shell=True, check=True, capture_output=True, text=True
        )
        print(f"   Success")
        if result.stdout:
            print(f"   Output: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"   Error: {e}")
        if e.stdout:
            print(f"   Stdout: {e.stdout}")
        if e.stderr:
            print(f"   Stderr: {e.stderr}")
        return False


def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")

    # Check Python
    try:
        import tree_sitter

        print("tree-sitter")
    except ImportError:
        print("tree-sitter - Install with: pip install tree-sitter")
        return False

    try:
        import lancedb

        print(" lancedb")
    except ImportError:
        print("lancedb - Install with: pip install lancedb")
        return False

    try:
        import langchain_openai

        print("langchain-openai")
    except ImportError:
        print(" langchain-openai - Install with: pip install langchain-openai")
        return False

    return True


def setup_tree_sitter():
    """Setup tree-sitter grammar"""
    if Path("build/my-languages.so").exists():
        print("  Tree-sitter grammar already exists")
        return True

    return run_command("python setup_tree_sitter.py", "Setting up tree-sitter grammar")


def index_codebase():
    """Index the codebase"""
    if Path("code_database").exists():
        print(" Database already exists")
        return True

    return run_command("python main.py index", "Indexing codebase")


def run_search_demo():
    """Run search demo"""
    return run_command("python test_search.py search", "Running search demo")


def main():
    """Main demo pipeline"""
    print("🚀 Code Semantic Search Demo Pipeline")
    print("=" * 50)

    # Step 1: Check dependencies
    if not check_dependencies():
        print("\n Please install missing dependencies:")
        print("   pip install -r requirements.txt")
        return

    # Step 2: Setup tree-sitter
    if not setup_tree_sitter():
        print("\n Failed to setup tree-sitter")
        return

    # Step 3: Index codebase
    if not index_codebase():
        print("\n Failed to index codebase")
        return

    # Step 4: Run search demo
    if not run_search_demo():
        print("\n Failed to run search demo")
        return

    print("\n Demo pipeline completed successfully!")
    print("\n Next steps:")
    print("   - Try custom queries: python main.py search 'your query'")
    print("   - Interactive mode: python main.py interactive")
    print("   - View database stats in code_database/")


if __name__ == "__main__":
    main()
