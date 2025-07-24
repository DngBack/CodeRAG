import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from tree_sitter import Language, Parser, Node
import re

class TreeSitterChunker:
    def __init__(self):
        """Initialize tree-sitter chunker with TypeScript/TSX grammar"""
        self.build_dir = Path("build")
        self.language = Language(str(self.build_dir / "my-languages.so"), 'typescript')
        self.parser = Parser()
        self.parser.set_language(self.language)
        
    def parse_file(self, file_path: str) -> Optional[Node]:
        """Parse a TSX/TS file and return the syntax tree root node"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            tree = self.parser.parse(bytes(content, "utf8"))
            return tree.root_node
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
            return None
    
    def extract_functions(self, node: Node, source_code: str) -> List[Dict[str, Any]]:
        """Extract function declarations and their metadata"""
        functions = []
        
        def traverse(node: Node):
            if node.type in ['function_declaration', 'arrow_function', 'method_definition']:
                # Get function name
                name_node = None
                if node.type == 'function_declaration':
                    name_node = node.child_by_field_name('name')
                elif node.type == 'method_definition':
                    name_node = node.child_by_field_name('name')
                
                function_name = name_node.text.decode('utf8') if name_node else 'anonymous'
                
                # Get function body
                body_node = node.child_by_field_name('body')
                if body_node:
                    function_code = body_node.text.decode('utf8')
                    start_line = body_node.start_point[0]
                    end_line = body_node.end_point[0]
                    
                    functions.append({
                        'type': 'function',
                        'name': function_name,
                        'code': function_code,
                        'start_line': start_line,
                        'end_line': end_line,
                        'node_type': node.type
                    })
            
            for child in node.children:
                traverse(child)
        
        traverse(node)
        return functions
    
    def extract_components(self, node: Node, source_code: str) -> List[Dict[str, Any]]:
        """Extract React components and their metadata"""
        components = []
        
        def traverse(node: Node):
            if node.type == 'variable_declarator':
                # Look for React component patterns
                name_node = node.child_by_field_name('name')
                value_node = node.child_by_field_name('value')
                
                if name_node and value_node:
                    name = name_node.text.decode('utf8')
                    value_text = value_node.text.decode('utf8')
                    
                    # Check if it's a React component (arrow function or function call)
                    if (value_node.type == 'arrow_function' or 
                        (value_node.type == 'call_expression' and 'React' in value_text)):
                        
                        # Get the component code
                        component_code = value_node.text.decode('utf8')
                        start_line = value_node.start_point[0]
                        end_line = value_node.end_point[0]
                        
                        components.append({
                            'type': 'component',
                            'name': name,
                            'code': component_code,
                            'start_line': start_line,
                            'end_line': end_line,
                            'node_type': value_node.type
                        })
            
            for child in node.children:
                traverse(child)
        
        traverse(node)
        return components
    
    def extract_imports(self, node: Node, source_code: str) -> List[Dict[str, Any]]:
        """Extract import statements"""
        imports = []
        
        def traverse(node: Node):
            if node.type == 'import_statement':
                import_text = node.text.decode('utf8')
                start_line = node.start_point[0]
                end_line = node.end_point[0]
                
                imports.append({
                    'type': 'import',
                    'code': import_text,
                    'start_line': start_line,
                    'end_line': end_line
                })
            
            for child in node.children:
                traverse(child)
        
        traverse(node)
        return imports
    
    def chunk_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Chunk a TSX/TS file into meaningful code segments"""
        root_node = self.parse_file(file_path)
        if not root_node:
            return []
        
        with open(file_path, 'r', encoding='utf-8') as f:
            source_code = f.read()
        
        chunks = []
        
        # Extract different types of code segments
        functions = self.extract_functions(root_node, source_code)
        components = self.extract_components(root_node, source_code)
        imports = self.extract_imports(root_node, source_code)
        
        # Add file-level metadata
        file_info = {
            'file_path': file_path,
            'file_name': Path(file_path).name,
            'total_lines': len(source_code.split('\n')),
            'file_size': len(source_code)
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