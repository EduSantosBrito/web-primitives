// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: "**/**/*.stories.ts",
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        button: resolve("lib", "Button/index.ts"),
        accordion: resolve("lib", "Accordion/index.ts"),
      },
      name: "WebPrimitives",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
