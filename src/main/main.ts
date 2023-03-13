import { app, BrowserWindow } from "electron";
import { openRankedLobby } from "./riot-lcu/requests";
import { getCredentials } from "./riot-lcu/internal/credentials";
// import { startAutoScript } from "./auto-script";

app.whenReady().then(async function () {
    const win = new BrowserWindow({
        width: 640,
        height: 720,
    });

    win.loadFile("./src/renderer/index.html");
    // await startAutoScript();
    console.log("----");
    console.log("----");
    console.log("----");
    console.log("----");
    console.log("----");
    const data = await openRankedLobby();
    console.log(data);
});
