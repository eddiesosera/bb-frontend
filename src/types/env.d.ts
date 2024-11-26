declare namespace NodeJS {
  interface ProcessEnv {
    API_BASE_URL: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
