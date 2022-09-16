//include packages
const { app, BrowserWindow} = require('electron');
const path = require('path')

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            //if app is activated and there are no windows create one
            //this is for mac, explained below
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        //close app if all windows are closed
        //exept when using mac (because mac apps normaly stay open in background)
        app.quit();
    } 
  })

const createWindow = () => {
    //create a window with size 800x600
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
    //load index.html in that window
    win.loadFile('index.html');
}