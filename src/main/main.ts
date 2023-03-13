import { app, BrowserWindow } from "electron";
import { startAutoScript } from "./auto-script";

app.whenReady().then(async function () {
    const win = new BrowserWindow({
        width: 720,
        height: 640,
    });

    win.loadFile("dist/renderer/index.html");
    win.webContents.openDevTools();
    await startAutoScript();
});
