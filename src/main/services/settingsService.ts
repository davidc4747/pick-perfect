import path from "path";
import { readFile, writeFile } from "fs/promises";
import { Settings } from "../../shared/types";

const DEFAULT_SETTINGS: Settings = {
    accecptReadyCheck: true,
    requeue: true,
    smiteKey: "D",
};

function getFileName(app: Electron.App): string {
    return path.join(app.getPath("userData"), "settings.json");
}

export async function readUserSettings(app: Electron.App): Promise<Settings> {
    try {
        const content: string = await readFile(getFileName(app), {
            encoding: "utf-8",
        });
        return JSON.parse(content);
    } catch (err) {
        // if the settings file is corrupted for any reason
        // OR if the file hasn't been created yet
        //      just return the default
        return DEFAULT_SETTINGS;
    }
}

export async function saveUserSettings(
    app: Electron.App,
    settings: Settings
): Promise<void> {
    await writeFile(getFileName(app), JSON.stringify(settings), {
        encoding: "utf-8",
    });
}
