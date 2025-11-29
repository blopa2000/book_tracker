interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_API_URL?: string;
  // agrega otras variables VITE_ aquí si las usas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
