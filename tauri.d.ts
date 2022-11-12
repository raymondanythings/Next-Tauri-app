import type * as app from "@tauri-apps/api/app";

declare global {
  interface Window {
    __TAURI__: {
      app?: typeof app;
    };
  }
}
