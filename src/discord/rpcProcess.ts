import path from "node:path";
import { type BrowserWindow, utilityProcess } from "electron";
import { getConfig } from "../common/config.js";
import { getDetectables } from "../common/detectables.js";
import { createInviteWindow } from "./window.js";

let child: Electron.UtilityProcess;
export let processList = [];

export function startRPC(window: BrowserWindow) {
    child = utilityProcess.fork(path.join(import.meta.dirname, "rpc.js"), undefined, {
        env: {
            detectables: JSON.stringify(getDetectables()),
            settings: JSON.stringify({
                processScanning: getConfig("processScanning"),
                windowsLegacyScanning: getConfig("windowsLegacyScanning"),
                scanInterval: getConfig("scanInterval"),
            }),
        },
        serviceName: "legcord-rpc",
    });

    child.on("spawn", () => {
        console.log("[arRPC] process started");
        console.log(child.pid);
    });

    child.on("message", (message) => {
        const json = JSON.parse(message);
        if (json.type === "invite") {
            createInviteWindow(json.code);
        } else if (json.type === "activity") {
            console.log("activity pulse");
            console.log(json.data);
            window.webContents.send("rpc", json.data);
        } else if (json.type === "processList") {
            console.log("[arRPC] updating process list");
            console.log(json.data);
            processList = json.data;
        }
    });

    child.on("exit", () => {
        console.log("[arRPC] process exited");
        console.log(child.pid);
    });
}

export function refreshProcessList() {
    child.postMessage({ message: "refreshProcessList" });
}
