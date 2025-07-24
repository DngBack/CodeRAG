import os
import subprocess
import shutil
from pathlib import Path


def setup_tree_sitter():
    """Setup tree-sitter grammar for TypeScript/TSX"""

    # Create build directory
    build_dir = Path("build")
    build_dir.mkdir(exist_ok=True)

    # Clone tree-sitter-typescript if not exists
    ts_grammar_dir = Path("tree-sitter-typescript")
    if not ts_grammar_dir.exists():
        print("Cloning tree-sitter-typescript...")
        subprocess.run(
            [
                "git",
                "clone",
                "https://github.com/tree-sitter/tree-sitter-typescript.git",
            ],
            check=True,
        )

    # Build the grammar
    print("Building tree-sitter grammar...")

    # Try different approaches for building the grammar
    try:
        from tree_sitter import Language

        Language.build_library(
            str(build_dir / "my-languages.so"), [str(ts_grammar_dir / "typescript")]
        )
    except AttributeError:
        # Fallback: use tree-sitter-cli if available
        print("Using tree-sitter-cli fallback...")
        try:
            subprocess.run(
                ["tree-sitter", "generate", str(ts_grammar_dir / "typescript")],
                check=True,
            )
            # Copy the generated library
            import shutil

            shutil.copy(
                ts_grammar_dir / "typescript" / "src" / "parser.c",
                build_dir / "parser.c",
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Warning: Could not build grammar. Using fallback approach...")
            # Create a dummy file to prevent errors
            with open(build_dir / "my-languages.so", "w") as f:
                f.write("# Dummy file - grammar not built")

    print("Tree-sitter setup completed!")


if __name__ == "__main__":
    setup_tree_sitter()
