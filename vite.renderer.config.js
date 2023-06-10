import { defineConfig } from "vite";

export default defineConfig({
    root: "src/renderer/",
    publicDir: "../../public",
    build: {
        outDir: "../../dist/",
    },
});
