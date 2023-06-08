import path from "path";
import { app } from "electron";
import { readFile, writeFile } from "fs/promises";
import { UserSelections } from "../../shared/types";

const SELECTIONS_FILE = path.join(app.getPath("userData"), "selections.json");

export const DEFAULT_SELECTIONS: UserSelections = {
    all: {
        ban: [17],
        hover: [],
        pick: [],
    },

    top: {
        ban: [266, 24, 54],
        hover: [],
        pick: [],
    },

    jungle: {
        ban: [121, 104, 64],
        hover: [],
        pick: [],
    },

    middle: {
        ban: [103, 157, 238],
        hover: [],
        pick: [],
    },

    bottom: {
        ban: [202, 81, 236],
        hover: [],
        pick: [],
    },

    utility: {
        ban: [412, 350, 117],
        hover: [],
        pick: [],
    },
};

export async function readSelections(): Promise<UserSelections> {
    try {
        const content: string = await readFile(SELECTIONS_FILE, {
            encoding: "utf-8",
        });
        return JSON.parse(content);
    } catch (err) {
        // if the settings file is corrupted for any reason
        // OR if the file hasn't been created yet
        //      just return the default
        return DEFAULT_SELECTIONS;
    }
}

export async function writeSelections(
    userSelection: UserSelections
): Promise<void> {
    await writeFile(SELECTIONS_FILE, JSON.stringify(userSelection), {
        encoding: "utf-8",
    });
}
