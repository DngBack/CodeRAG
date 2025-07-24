# Code Semantic Search với Tree-Sitter và LanceDB

Hệ thống semantic search cho code sử dụng tree-sitter chunking và LanceDB để index và tìm kiếm code một cách thông minh.

## Tính năng

- **Tree-sitter Chunking**: Phân tích code TSX/TS dựa trên cú pháp thực tế
- **Semantic Search**: Tìm kiếm code dựa trên ý nghĩa sử dụng OpenAI embeddings
- **LanceDB**: Lưu trữ vector database hiệu suất cao
- **LangChain Integration**: Tích hợp với LangChain ecosystem

## Cài đặt

1. **Cài đặt Python dependencies:**

```bash
pip install -r requirements.txt
```

2. **Setup tree-sitter grammar:**

```bash
python setup_tree_sitter.py
```

3. **Cài đặt OpenAI API key (tùy chọn):**

```bash
export OPENAI_API_KEY="your-api-key-here"
```

## Sử dụng

### 1. Index codebase

Index toàn bộ codebase từ thư mục `src/`:

```bash
python main.py index
```

Hoặc chỉ định thư mục khác:

```bash
python main.py index ./src
```

Với OpenAI API key:

```bash
python main.py index ./src your-openai-api-key
```

### 2. Tìm kiếm code

Tìm kiếm với query cụ thể:

```bash
python main.py search "Implement header"
```

### 3. Chế độ interactive

Chạy chế độ tìm kiếm tương tác:

```bash
python main.py interactive
```

## Ví dụ sử dụng

### Index codebase

```bash
$ python main.py index
Setting up environment...
Starting codebase indexing from src...
Chunking code files...
Chunking src/components/atoms/Button/index.tsx...
Chunking src/components/molecules/Button/index.tsx...
Found 45 chunks
Indexing chunks into LanceDB...
Successfully indexed 45 chunks
Indexing completed! Indexed 45 chunks

Database Statistics:
Total chunks: 45
Chunk types: {'component': 25, 'function': 15, 'import': 5}
Files indexed: 12
```

### Tìm kiếm semantic

```bash
$ python main.py search "Implement header"
Searching for: 'Implement header'

Found 3 results:
================================================================================

1. Header (component)
   File: UserNavigationBar/index.tsx
   Lines: 15-45
   Similarity: 0.892
   Code preview:
   const Header = () => {
     return (
       <header className="bg-white shadow-sm">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center py-4">
             <div className="flex items-center">
               <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
             </div>
           </div>
         </div>
       </header>
     );
   };
   ...

2. NavigationHeader (component)
   File: AuthenticatedNavigationBar/index.tsx
   Lines: 10-35
   Similarity: 0.845
   Code preview:
   const NavigationHeader = () => {
     return (
       <nav className="bg-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center justify-between h-16">
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
               </div>
             </div>
           </div>
         </div>
       </nav>
     );
   };
   ...
```

## Cấu trúc dự án

```
├── main.py                 # Script chính
├── tree_sitter_chunker.py  # Tree-sitter chunking logic
├── code_indexer.py         # LanceDB indexing và search
├── setup_tree_sitter.py    # Setup tree-sitter grammar
├── requirements.txt        # Python dependencies
├── build/                  # Compiled tree-sitter grammar
└── code_database/          # LanceDB database files
```

## Cách hoạt động

### 1. Tree-sitter Chunking

- Parse code TSX/TS sử dụng tree-sitter grammar
- Extract functions, components, imports dựa trên AST
- Tạo chunks có ý nghĩa với metadata đầy đủ

### 2. Semantic Indexing

- Sử dụng OpenAI embeddings để vectorize code chunks
- Lưu trữ trong LanceDB với schema tối ưu
- Hỗ trợ chunking dài và overlap

### 3. Semantic Search

- Tìm kiếm dựa trên cosine similarity
- Filter theo threshold và ranking
- Hiển thị kết quả với preview code

## Tùy chỉnh

### Thay đổi chunk size

Trong `code_indexer.py`:

```python
self.text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # Thay đổi kích thước chunk
    chunk_overlap=200, # Thay đổi overlap
)
```

### Thay đổi similarity threshold

```python
results = indexer.search_similar(query, threshold=0.8)  # Tăng threshold
```

### Thêm chunk types mới

Trong `tree_sitter_chunker.py`, thêm methods extract mới:

```python
def extract_classes(self, node: Node, source_code: str):
    # Logic extract classes
    pass
```

## Troubleshooting

### Lỗi tree-sitter grammar

```bash
# Rebuild grammar
rm -rf build/
python setup_tree_sitter.py
```

### Lỗi OpenAI API

- Kiểm tra API key
- Kiểm tra quota và billing
- Sử dụng fallback embedding nếu cần

### Lỗi LanceDB

```bash
# Reset database
rm -rf code_database/
```

## Performance

- **Indexing**: ~1000 chunks/phút (tùy thuộc vào OpenAI API)
- **Search**: <100ms cho queries đơn giản
- **Memory**: ~50MB cho 1000 chunks
- **Storage**: ~10MB cho 1000 chunks với embeddings
