import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookForm from "../../components/BookForm";

describe("BookForm Component", () => {
  test("llama a onAdd con los valores correctos al hacer submit", async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn(); // Vitest

    render(<BookForm onAdd={mockOnAdd} />);

    // Llenar inputs usando placeholder
    await user.type(screen.getByPlaceholderText(/Título/i), "Libro Test");
    await user.type(screen.getByPlaceholderText(/Autor/i), "Juan");
    await user.selectOptions(screen.getByRole("combobox"), "Pendiente");
    await user.type(screen.getByPlaceholderText(/Rating/i), "5");

    // Hacer click en el botón "Agregar"
    await user.click(screen.getByRole("button", { name: /Agregar/i }));

    // Verificar que se llamó onAdd con los valores correctos
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith({
      title: "Libro Test",
      author: "Juan",
      status: "Pendiente",
      rating: 5,
    });
  });
});
