export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/books"
    : "http://backend:5001/api/books";
