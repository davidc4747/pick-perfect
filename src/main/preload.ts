import { contextBridge, ipcRenderer } from "electron";
import { UserSelections } from "../shared/types";

contextBridge.exposeInMainWorld("electron", {
    updateSelections: (data: UserSelections) =>
        ipcRenderer.send("updateSelections", data),
    getSelections: () => ipcRenderer.invoke("getSelections"),
});
