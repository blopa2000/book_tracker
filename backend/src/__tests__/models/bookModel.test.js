/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// IMPORTAR EL MODELO
import Book from "../../models/Book.js";

let mongoServer;

/** ============================
 * 🔧 SETUP ANTES DE TODOS LOS TESTS
 * ============================ */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

/** ============================
 * 🧹 LIMPIAR ENTRE TESTS
 * ============================ */
afterEach(async () => {
  await Book.deleteMany();
});

/** ============================
 * 🛑 FINALIZAR BD DE PRUEBA
 * ============================ */
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

/** ============================
 * 🧪 TESTS DEL MODELO BOOK
 * ============================ */

describe("Book Model", () => {
  test("Debe crear un libro correctamente", async () => {
    const data = { title: "Libro 1", author: "Juan" };

    const book = await Book.create(data);

    expect(book.title).toBe("Libro 1");
    expect(book.author).toBe("Juan");
  });

  test("Debe asignar valores por defecto", async () => {
    const data = { title: "Libro sin rating", author: "Ana" };

    const book = await Book.create(data);

    expect(book.status).toBe("Pendiente");
    expect(book.rating).toBe(0);
    expect(book.createdAt).toBeInstanceOf(Date);
  });

  test("Debe lanzar error si falta el título", async () => {
    const data = { author: "Pedro" };

    await expect(Book.create(data)).rejects.toThrow();
  });

  test("Debe lanzar error si falta el autor", async () => {
    const data = { title: "Libro sin autor" };

    await expect(Book.create(data)).rejects.toThrow();
  });

  test("Debe aceptar rating numérico", async () => {
    const data = { title: "Calificado", author: "Luis", rating: 5 };

    const book = await Book.create(data);

    expect(book.rating).toBe(5);
  });
});
