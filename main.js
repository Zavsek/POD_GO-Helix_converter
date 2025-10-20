import { app, BrowserWindow } from "electron";

const createWindow = () =>{
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences:{
          nodeIntegration: true,
          contextIsolation: false,
        },
    })

    win.loadURL('http://localhost:5173');
}



const startApp = async () => {
  await app.whenReady();  
  createWindow();

     app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });
};
startApp();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})