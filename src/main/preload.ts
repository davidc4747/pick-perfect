import { contextBridge, ipcRenderer } from "electron";
import { UserSelections } from "../shared/types";

contextBridge.exposeInMainWorld("electron", {
    updateSelections: (data: UserSelections): void =>
        ipcRenderer.send("updateSelections", data),
    getSelections: (): Promise<UserSelections> =>
        ipcRenderer.invoke("getSelections"),
});
