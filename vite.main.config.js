import { defineConfig } from "vite";

export default defineConfig({
    build: {
        ssr: {
            noExternal: true,
        },
        outDir: "dist/",
    },
});
