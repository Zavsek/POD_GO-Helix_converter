import { app, BrowserWindow, ipcMain, Menu } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

Menu.setApplicationMenu(null);
dotenv.config();
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
  if(process.env.NODE_ENV == "DEV") win.loadURL('http://localhost:5173'); 
  else{
    const indexPath = path.resolve(__dirname, "Frontend", "dist", "index.html");
      win.loadFile(indexPath);
  }
  ipcMain.handle("window-minimize", () => win.minimize());
  ipcMain.handle("window-close", () => win.close());

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
