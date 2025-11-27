import { useState } from "react";
import styles from "../styles/BookForm.module.css";

interface BookFormProps {
  onAdd: (book: { title: string; author: string; status: string; rating: number }) => void;
}

export default function BookForm({ onAdd }: BookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({ title, author, status, rating });

    setTitle("");
    setAuthor("");
    setStatus("Pendiente");
    setRating(0);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Agregar Libro</h2>

      <input
        className={styles.input}
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />

      <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pendiente">Pendiente</option>
        <option value="Leyendo">Leyendo</option>
        <option value="Terminado">Terminado</option>
      </select>

      <input
        className={styles.input}
        type="number"
        min={0}
        max={5}
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      <button className={styles.button}>Agregar</button>
    </form>
  );
}
