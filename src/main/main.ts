import path from "path";
import {
    app,
    ipcMain,
    Tray,
    Menu,
    MenuItem,
    BrowserWindow,
    IpcMainEvent,
} from "electron";
import { listenToRiotEvents } from "./services/auto-script";
import { UserSelections } from "../shared/types";
import { updateSelections, getAllSelections } from "./services/userSelections";

/* ======================== *\
    #App
\* ======================== */

let mainWindow: BrowserWindow;
app.whenReady().then(async function () {
    const appIcon = path.resolve("dist/champ-placeholder.png");
    mainWindow = createWindow(appIcon);
    const tray = createTrayIcon(appIcon, closeApp);
    tray.on("click", function name() {
        mainWindow.show();
    });

    await listenToRiotEvents();
});

async function closeApp() {
    app.exit();
}

/* ------------------------- *\
    #Events
\* ------------------------- */

ipcMain.on(
    "updateSelections",
    function (event: IpcMainEvent, data: UserSelections) {
        updateSelections(data);
    }
);

ipcMain.handle("getSelections", function () {
    return getAllSelections();
});

/* ======================== *\
    #Window
\* ======================== */

function createWindow(iconPath: string): BrowserWindow {
    const win = new BrowserWindow({
        width: 760,
        height: 800,
        resizable: false,
        show: false,
        icon: iconPath,
        webPreferences: {
            preload: path.resolve("dist/preload/preload.js"),
        },
    });

    win.loadFile(path.resolve("dist/renderer/index.html"));
    win.removeMenu();
    // win.webContents.openDevTools();
    win.once("ready-to-show", () => {
        win.show();
    });
    // Minilize to system Tray instead of Quiting
    win.on("close", (event) => {
        event.preventDefault();
        win.hide();
    });
    return win;
}

function createTrayIcon(iconPath: string, closeApp: () => void): Tray {
    const tray = new Tray(iconPath);
    tray.setToolTip("One Trick");

    const menu = [
        new MenuItem({
            label: "Quit",
            type: "normal",
            click: closeApp,
        }),
    ];
    tray.setContextMenu(Menu.buildFromTemplate(menu));
    return tray;
}
