import { describe, test, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookItem from "../../components/BookItem";

describe("BookItem Component", () => {
  const mockBook = {
    _id: "1",
    title: "Libro Test",
    author: "Juan",
    status: "Pendiente",
    rating: 4,
    createdAt: new Date(),
  };

  test("muestra los datos del libro correctamente", () => {
    render(<BookItem book={mockBook} onDelete={vi.fn()} onUpdate={vi.fn()} />);

    expect(screen.getByText(/Libro Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Autor: Juan/i)).toBeInTheDocument();
    expect(screen.getByText(/⭐ 4\/5/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Pendiente/i)).toBeInTheDocument();
  });

  test("llama a onUpdate al cambiar el estado", async () => {
    const user = userEvent.setup();
    const mockUpdate = vi.fn();

    render(<BookItem book={mockBook} onDelete={vi.fn()} onUpdate={mockUpdate} />);

    await user.selectOptions(screen.getByRole("combobox"), "Leyendo");

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith("1", { status: "Leyendo" });
  });

  test("llama a onDelete al hacer click en eliminar", async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();

    render(<BookItem book={mockBook} onDelete={mockDelete} onUpdate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /Eliminar/i }));

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });
});
