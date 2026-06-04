const { ipcRenderer } = require("electron");

import { addStyle } from "../../common/dom.js";
import { sleep } from "../../common/sleep.js";

if (
    ipcRenderer.sendSync("getConfig", "windowStyle") === "default" ||
    ipcRenderer.sendSync("getConfig", "windowStyle") === "overlay"
) {
    document.addEventListener("DOMContentLoaded", () => {
        document.body.setAttribute("legcord-platform", ipcRenderer.sendSync("getOS"));
        addStyle("legcord://assets/css/baseTitlebar.css");
        sleep(500);
        switch (ipcRenderer.sendSync("getOS")) {
            case "darwin":
                // breaks traffic lights with bar__ and hidden__ classes
                // document.body.setAttribute("class", "platform-osx");
                addStyle("legcord://assets/css/darwinTitlebar.css");
                break;
            case "win32":
                document.body.setAttribute("class", "platform-win");
                addStyle("legcord://assets/css/winTitlebar.css");
                break;
            case "linux":
                document.body.setAttribute("class", "platform-linux");
                addStyle("legcord://assets/css/linuxTitlebar.css");
                break;
            default:
                break;
        }
    });
}
