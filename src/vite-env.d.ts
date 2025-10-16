/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_LOCAL_AMPLIFY: string;
  readonly VITE_GRAPHQL_ENDPOINT: string;
  // add any other VITE_ env vars you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
