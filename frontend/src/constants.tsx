export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/books"
    : "http://backend:5000/api/books";
