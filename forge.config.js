module.exports = {
    packagerConfig: {
        name: "OneTick",
        icon: "D:/scripts/one-trick/dist/icon.ico",
        ignore(str) {
            return (
                str.includes(".git") ||
                str.includes("cypress") ||
                str.includes("docs") ||
                str.includes("public") ||
                str.includes("readme") ||
                str.includes("src") ||
                str.includes("forge.config") ||
                str.includes("README") ||
                str.includes("tsconfig") ||
                str.includes("type.d.ts") ||
                str.includes("vite.main") ||
                str.includes("vite.renderer") ||
                str.includes("package-lock.json") ||
                str.startsWith("/.eslintrc")
            );
        },
        asar: true,
    },
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {},
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"],
        },
        {
            name: "@electron-forge/maker-deb",
            config: {},
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {},
        },
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-vite",
            config: {
                build: [
                    {
                        entry: "src/main/main.ts",
                        config: "vite.main.config.js",
                    },
                    {
                        entry: "src/main/preload.ts",
                        config: "vite.main.config.js",
                    },
                ],
                renderer: [
                    {
                        name: "main_window",
                        config: "vite.renderer.config.js",
                    },
                ],
            },
        },
    ],
};
