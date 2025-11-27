import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import type { Book } from "../types/Book";
import { API_URL } from "../constants";

const mockBooks: Book[] = [
  {
    _id: "1",
    title: "Libro 1",
    author: "Juan",
    status: "Pendiente",
    rating: 3,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Libro 2",
    author: "Ana",
    status: "Leyendo",
    rating: 5,
    createdAt: new Date(),
  },
];

describe("App Component", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockBooks),
        })
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Renderiza correctamente la lista de libros al iniciar", async () => {
    render(<App />);

    // Esperar a que los títulos de los libros se rendericen
    for (const book of mockBooks) {
      await waitFor(() => expect(screen.getByText(book.title)).toBeInTheDocument());
    }
  });

  test("agregar un libro llama a fetch y muestra el nuevo libro", async () => {
    // Mock de fetch más completo: POST y luego GET con el libro agregado
    const mockFetch = vi.fn((url, options) => {
      if (options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);
      }
      // GET request devuelve la lista incluyendo el libro agregado
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            ...mockBooks,
            {
              _id: "3",
              title: "Libro Test",
              author: "Juan",
              status: "Pendiente",
              rating: 0,
              createdAt: new Date(),
            },
          ]),
      } as Response);
    });

    vi.stubGlobal("fetch", mockFetch);

    render(<App />);
    const user = userEvent.setup();

    // llenar el formulario
    await user.type(screen.getByPlaceholderText(/Título/i), "Libro Test");
    await user.type(screen.getByPlaceholderText(/Autor/i), "Juan");
    await user.click(screen.getByText("Agregar"));

    // verificar que fetch fue llamado con POST
    expect(mockFetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Libro Test",
          author: "Juan",
          status: "Pendiente",
          rating: 0,
        }),
      })
    );

    // verificar que el libro aparece en la lista después del POST + GET
    const libro = await screen.findByText("Libro Test");
    expect(libro).toBeInTheDocument();
  });

  test("actualizar el estado de un libro llama a fetch con PUT y refleja el cambio", async () => {
    const mockFetch = vi.fn((url, options) => {
      if (options?.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBooks),
      } as Response);
    });

    vi.stubGlobal("fetch", mockFetch);

    render(<App />);
    const user = userEvent.setup();

    // Esperar a que la lista se renderice
    await waitFor(() => screen.getByText("Libro 1"));

    // Cambiar el estado del primer libro
    const select = screen.getAllByLabelText("Estado:")[0];
    await user.selectOptions(select, "Leyendo");

    // Verificar que fetch fue llamado con PUT
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/1`,
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Leyendo" }),
      })
    );
  });

  test("eliminar un libro llama a fetch con DELETE y remueve el libro de la lista", async () => {
    const mockFetch = vi.fn((url, options) => {
      if (options?.method === "DELETE") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBooks) } as Response);
    });

    vi.stubGlobal("fetch", mockFetch);

    render(<App />);
    const user = userEvent.setup();

    // Esperar a que la lista se renderice
    await waitFor(() => screen.getByText("Libro 1"));

    // Hacer click en "Eliminar" del primer libro
    const deleteButton = screen.getAllByText("Eliminar")[0];
    await user.click(deleteButton);

    // Verificar que fetch fue llamado con DELETE
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/1`,
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });
});
