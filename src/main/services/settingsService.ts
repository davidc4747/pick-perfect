import path from "path";
import { app } from "electron";
import { readFile, writeFile } from "fs/promises";
import { Settings } from "../../shared/types";

const SETTING_FILE = path.join(app.getPath("userData"), "settings.json");

const DEFAULT_SETTINGS: Settings = {
    shouldAcceptReadyCheck: true,
    shouldRequeue: true,
    smiteKey: "D",
};

export async function readSettings(): Promise<Settings> {
    try {
        const content: string = await readFile(SETTING_FILE, {
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

export async function writeSettings(settings: Settings): Promise<void> {
    await writeFile(SETTING_FILE, JSON.stringify(settings), {
        encoding: "utf-8",
    });
}
