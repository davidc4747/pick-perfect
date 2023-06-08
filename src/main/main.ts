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
import { Settings, UserSelections } from "../shared/types";
import { update, getAllSelections } from "./services/model";
import { readSelections, writeSelections } from "./services/selectionsService";
import { readSettings, writeSettings } from "./services/settingsService";

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

    // Load User Selections
    const data = await readSelections();
    update(data);

    // Start up event listeners
    await listenToRiotEvents();
});

async function closeApp() {
    // Save Selections to a file
    // await writeSelections(getAllSelections());
    app.exit();
}

/* ------------------------- *\
    #Events
\* ------------------------- */

ipcMain.on(
    "updateSelections",
    async function (_: IpcMainEvent, data: UserSelections) {
        // update Model
        update(data);
        // Save to File
        await writeSelections(data);
    }
);

ipcMain.handle("getSelections", function (): UserSelections {
    return getAllSelections();
});

ipcMain.on("updateSettings", function (_: IpcMainEvent, data: Settings) {
    writeSettings(data);
});

ipcMain.handle("getSettings", async function (): Promise<Settings> {
    return await readSettings();
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
