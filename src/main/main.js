const { app, BrowserWindow } = require("electron");

app.whenReady().then(function () {
    const win = new BrowserWindow({
        width: 640,
        height: 720,
    });

    win.loadFile("./src/renderer/index.html");
});
