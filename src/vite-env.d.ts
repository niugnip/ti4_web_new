/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOT_PROXY_TARGET?: string;
  readonly VITE_WEBSOCKET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
