import BookItem from "./BookItem";
import styles from "../styles/BookList.module.css";
import type { Book } from "../types/Book";

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Book>) => void;
}

export default function BookList({ books, onDelete, onUpdate }: BookListProps) {
  return (
    <div className={styles.list}>
      {books.map((book) => (
        <BookItem key={book._id} book={book} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
