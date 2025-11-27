/**
 * @jest-environment node
 */

import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Importar rutas reales
import bookRoutes from "../../routes/bookRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("📌 TESTS DE INTEGRACIÓN - Books API", () => {
  test("POST /api/books debe crear un libro", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ title: "Nuevo libro", author: "Juan" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Nuevo libro");
  });

  test("GET /api/books debe devolver lista de libros", async () => {
    const res = await request(app).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("PUT /api/books/:id debe actualizar un libro", async () => {
    const created = await request(app)
      .post("/api/books")
      .send({ title: "Original", author: "Luis" });

    const id = created.body._id;

    const res = await request(app).put(`/api/books/${id}`).send({ title: "Actualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Actualizado");
  });

  test("DELETE /api/books/:id debe eliminar un libro", async () => {
    const created = await request(app)
      .post("/api/books")
      .send({ title: "Para borrar", author: "Ana" });

    const id = created.body._id;

    const res = await request(app).delete(`/api/books/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Libro eliminado");
  });
});
