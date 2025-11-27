import styles from "../styles/BookItem.module.css";
import type { Book } from "../types/Book";

interface Props {
  book: Book;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Book>) => void;
}

export default function BookItem({ book, onDelete, onUpdate }: Props) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(book._id, { status: e.target.value });
  };

  return (
    <div className={styles.card}>
      <h3>{book.title}</h3>
      <p className={styles.author}>Autor: {book.author}</p>

      <div className={styles.row}>
        <label htmlFor={`status-${book._id}`}>Estado:</label>
        <select
          id={`status-${book._id}`}
          value={book.status}
          onChange={handleStatusChange}
          className={styles.select}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Leyendo">Leyendo</option>
          <option value="Terminado">Terminado</option>
        </select>
      </div>

      <p className={styles.rating}>⭐ {book.rating}/5</p>

      <button className={styles.deleteButton} onClick={() => onDelete(book._id)}>
        Eliminar
      </button>
    </div>
  );
}
