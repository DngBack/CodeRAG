import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import re


class SimpleTreeSitterChunker:
    def __init__(self):
        """Initialize simple chunker without tree-sitter grammar"""
        pass

    def parse_file(self, file_path: str) -> Optional[dict]:
        """Parse a TSX/TS file using regex patterns"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            return {"content": content, "lines": content.split("\n")}
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
            return None

    def extract_functions(
        self, parsed_file: dict, source_code: str
    ) -> List[Dict[str, Any]]:
        """Extract function declarations using regex"""
        functions = []
        lines = parsed_file["lines"]

        # Patterns for different function types
        patterns = [
            # Function declaration: function name() { ... }
            r"function\s+(\w+)\s*\([^)]*\)\s*\{",
            # Arrow function: const name = () => { ... }
            r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{",
            # Arrow function: const name = () => ( ... )
            r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\(",
            # Method definition: name() { ... }
            r"(\w+)\s*\([^)]*\)\s*\{",
        ]

        for i, line in enumerate(lines):
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    function_name = match.group(1)

                    # Find function body (simplified)
                    start_line = i
                    end_line = self._find_function_end(lines, i)

                    function_code = "\n".join(lines[start_line : end_line + 1])

                    functions.append(
                        {
                            "type": "function",
                            "name": function_name,
                            "code": function_code,
                            "start_line": start_line,
                            "end_line": end_line,
                            "node_type": "function_declaration",
                        }
                    )
                    break

        return functions

    def extract_components(
        self, parsed_file: dict, source_code: str
    ) -> List[Dict[str, Any]]:
        """Extract React components using regex"""
        components = []
        lines = parsed_file["lines"]

        # Patterns for React components
        patterns = [
            # const Component = () => { ... }
            r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{",
            # const Component = () => ( ... )
            r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\(",
            # export default function Component() { ... }
            r"export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*\{",
            # function Component() { ... }
            r"function\s+(\w+)\s*\([^)]*\)\s*\{",
        ]

        for i, line in enumerate(lines):
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    component_name = match.group(1)

                    # Find component body
                    start_line = i
                    end_line = self._find_function_end(lines, i)

                    component_code = "\n".join(lines[start_line : end_line + 1])

                    components.append(
                        {
                            "type": "component",
                            "name": component_name,
                            "code": component_code,
                            "start_line": start_line,
                            "end_line": end_line,
                            "node_type": "component",
                        }
                    )
                    break

        return components

    def extract_imports(
        self, parsed_file: dict, source_code: str
    ) -> List[Dict[str, Any]]:
        """Extract import statements using regex"""
        imports = []
        lines = parsed_file["lines"]

        import_pattern = r"^import\s+.*$"

        for i, line in enumerate(lines):
            if re.match(import_pattern, line.strip()):
                imports.append(
                    {
                        "type": "import",
                        "code": line.strip(),
                        "start_line": i,
                        "end_line": i,
                    }
                )

        return imports

    def _find_function_end(self, lines: List[str], start_line: int) -> int:
        """Find the end of a function/component (simplified)"""
        brace_count = 0
        in_function = False

        for i in range(start_line, len(lines)):
            line = lines[i]

            # Count braces
            brace_count += line.count("{")
            brace_count -= line.count("}")

            if not in_function and "{" in line:
                in_function = True

            if in_function and brace_count == 0:
                return i

        return len(lines) - 1

    def chunk_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Chunk a TSX/TS file into meaningful code segments"""
        parsed_file = self.parse_file(file_path)
        if not parsed_file:
            return []

        with open(file_path, "r", encoding="utf-8") as f:
            source_code = f.read()

        chunks = []

        # Extract different types of code segments
        functions = self.extract_functions(parsed_file, source_code)
        components = self.extract_components(parsed_file, source_code)
        imports = self.extract_imports(parsed_file, source_code)

        # Add file-level metadata
        file_info = {
            "file_path": file_path,
            "file_name": Path(file_path).name,
            "total_lines": len(source_code.split("\n")),
            "file_size": len(source_code),
        }

        # Combine all chunks with file info
        for chunk in functions + components + imports:
            chunk.update(file_info)
            chunks.append(chunk)

        return chunks

    def chunk_directory(self, directory_path: str) -> List[Dict[str, Any]]:
        """Chunk all TSX/TS files in a directory"""
        all_chunks = []
        directory = Path(directory_path)

        # Find all TSX and TS files
        tsx_files = list(directory.rglob("*.tsx"))
        ts_files = list(directory.rglob("*.ts"))

        all_files = tsx_files + ts_files

        for file_path in all_files:
            print(f"Chunking {file_path}...")
            chunks = self.chunk_file(str(file_path))
            all_chunks.extend(chunks)

        return all_chunks
