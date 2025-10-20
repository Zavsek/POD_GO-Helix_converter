import { app, BrowserWindow, ipcMain, Menu } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// odstrani sistemski menu
Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 650,
    resizable: false,
    maximizable: false,
    minimizable: true,
    frame: false, 
    webPreferences: {
        nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173");

  // IPC ukazi
  ipcMain.handle("window-minimize", () => win.minimize());
  ipcMain.handle("window-close", () => win.close());
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
