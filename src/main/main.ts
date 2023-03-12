import { app, BrowserWindow } from "electron";
import { startAutoScript } from "./auto-script";

app.whenReady().then(async function () {
    const win = new BrowserWindow({
        width: 640,
        height: 720,
    });

    win.loadFile("./src/renderer/index.html");
    await startAutoScript();
});
