/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_LIVE_AI?: string
  readonly VITE_ANTHROPIC_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
