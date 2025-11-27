import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// 1️⃣ Mockeamos el módulo ANTES de importarlo
const mockGetBooks = jest.fn((req, res) => res.json([]));
const mockAddBook = jest.fn((req, res) => res.json({}));
const mockUpdateBook = jest.fn((req, res) => res.json({}));
const mockDeleteBook = jest.fn((req, res) => res.json({}));

jest.unstable_mockModule("../../controllers/bookController.js", () => ({
  __esModule: true,
  getBooks: mockGetBooks,
  addBook: mockAddBook,
  updateBook: mockUpdateBook,
  deleteBook: mockDeleteBook,
}));

// 2️⃣ Importamos router DESPUÉS de mockear
const router = (await import("../../routes/bookRoutes.js")).default;

describe("Book Routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/books", router);

  test("GET /api/books debe llamar a getBooks", async () => {
    await request(app).get("/api/books");

    expect(mockGetBooks).toHaveBeenCalled();
  });

  test("POST /api/books debe llamar a addBook", async () => {
    await request(app).post("/api/books").send({ title: "Test" });

    expect(mockAddBook).toHaveBeenCalled();
  });

  test("PUT /api/books/:id debe llamar a updateBook", async () => {
    await request(app).put("/api/books/123").send({ title: "Nuevo" });

    expect(mockUpdateBook).toHaveBeenCalled();
  });

  test("DELETE /api/books/:id debe llamar a deleteBook", async () => {
    await request(app).delete("/api/books/123");

    expect(mockDeleteBook).toHaveBeenCalled();
  });
});
