import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // permite usar `describe`, `test`, `expect` sin importarlos
    environment: "jsdom", // emula navegador
    setupFiles: "./src/setupTests.ts", // opcional, para imports globales de testing-library
    coverage: {
      reporter: ["text", "lcov"], // cobertura en consola y lcov para codecov
    },
  },
});
