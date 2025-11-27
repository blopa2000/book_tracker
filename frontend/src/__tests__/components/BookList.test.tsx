import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookList from "../../components/BookList";
import type { Book } from "../../types/Book";

describe("BookList Component", () => {
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

  const mockDelete = vi.fn();
  const mockUpdate = vi.fn();

  test("Muestra todos los libros", () => {
    render(<BookList books={mockBooks} onDelete={mockDelete} onUpdate={mockUpdate} />);

    expect(screen.getByText("Libro 1")).toBeInTheDocument();
    expect(screen.getByText("Libro 2")).toBeInTheDocument();
  });

  test("Llama a onDelete al presionar el botón eliminar de un libro", async () => {
    render(<BookList books={mockBooks} onDelete={mockDelete} onUpdate={mockUpdate} />);

    const user = userEvent.setup();
    const deleteButtons = screen.getAllByText("Eliminar");
    await user.click(deleteButtons[0]);

    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  test("Llama a onUpdate al cambiar el estado de un libro", async () => {
    render(<BookList books={mockBooks} onDelete={mockDelete} onUpdate={mockUpdate} />);

    const user = userEvent.setup();
    const selects = screen.getAllByLabelText("Estado:");
    await user.selectOptions(selects[0], "Leyendo");

    expect(mockUpdate).toHaveBeenCalledWith("1", { status: "Leyendo" });
  });
});
