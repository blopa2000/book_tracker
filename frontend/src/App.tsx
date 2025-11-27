import { useEffect, useState } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import { API_URL } from "./constants";
import type { Book } from "./types/Book";

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  const loadBooks = async () => {
    const res = await fetch(`${API_URL}`);
    const data = await res.json();
    setBooks(data);
  };

  const addBook = async (book: Partial<Book>) => {
    await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });

    loadBooks();
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    loadBooks();
  };

  const deleteBook = async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    loadBooks();
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="app-container">
      <h1>📚 Book Tracker</h1>

      <BookForm onAdd={addBook} />

      <BookList books={books} onUpdate={updateBook} onDelete={deleteBook} />
    </div>
  );
}

export default App;
