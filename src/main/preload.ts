import { contextBridge, ipcRenderer } from "electron";
import { UserSelections, Settings } from "../shared/types";

contextBridge.exposeInMainWorld("electron", {
    updateSelections: (data: UserSelections): void =>
        ipcRenderer.send("updateSelections", data),
    getSelections: (): Promise<UserSelections> =>
        ipcRenderer.invoke("getSelections"),

    updateSettings: (data: Settings): void =>
        ipcRenderer.send("updateSettings", data),
    getSettings: (): Promise<Settings> => ipcRenderer.invoke("getSettings"),
});
