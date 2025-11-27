import { jest } from "@jest/globals";

// ───────────────────────────────
// MOCKS
// ───────────────────────────────
const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

const mockBookConstructor = jest.fn(function (data) {
  this.save = jest.fn().mockResolvedValue(data);
});

jest.unstable_mockModule("../../models/Book.js", () => ({
  __esModule: true,
  default: Object.assign(mockBookConstructor, {
    find: mockFind,
    create: mockCreate,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findByIdAndDelete: mockFindByIdAndDelete,
  }),
}));

// Importaciones reales después del mock
const Book = (await import("../../models/Book.js")).default;
const { getBooks, addBook, updateBook, deleteBook } = await import(
  "../../controllers/bookController.js"
);

// ───────────────────────────────
// TESTS
// ───────────────────────────────

let res;

beforeEach(() => {
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
});

describe("Book Controller", () => {
  test("getBooks debe retornar un JSON con el listado de libros", async () => {
    const mockBooks = [{ title: "Libro A" }, { title: "Libro B" }];

    mockFind.mockResolvedValue(mockBooks);

    await getBooks({}, res);

    expect(mockFind).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  test("addBook debe guardar un libro y retornarlo", async () => {
    const mockSavedBook = { title: "Libro Nuevo" };

    const req = { body: mockSavedBook };

    await addBook(req, res);

    expect(res.json).toHaveBeenCalledWith(mockSavedBook);
  });

  test("updateBook debe actualizar un libro y retornarlo", async () => {
    const updatedData = { title: "Nuevo Título" };

    mockFindByIdAndUpdate.mockResolvedValue(updatedData);

    await updateBook({ params: { id: "123" }, body: updatedData }, res);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith("123", updatedData, { new: true });
    expect(res.json).toHaveBeenCalledWith(updatedData);
  });

  test("deleteBook debe eliminar un libro y retornar un mensaje", async () => {
    mockFindByIdAndDelete.mockResolvedValue({});

    await deleteBook({ params: { id: "123" } }, res);

    expect(mockFindByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith({ message: "Libro eliminado" });
  });
});
