import path from "path";
import { readFile, writeFile } from "fs/promises";
import { UserSelections } from "../../shared/types";

function getFileName(app: Electron.App): string {
    return path.join(app.getPath("userData"), "selections.json");
}

export async function readUserData(
    app: Electron.App
): Promise<UserSelections | null> {
    try {
        const content: string = await readFile(getFileName(app), {
            encoding: "utf-8",
        });
        return JSON.parse(content);
    } catch (err) {
        return null;
    }
}

export async function saveUserData(
    app: Electron.App,
    userSelection: UserSelections
): Promise<void> {
    await writeFile(getFileName(app), JSON.stringify(userSelection), {
        encoding: "utf-8",
    });
}
