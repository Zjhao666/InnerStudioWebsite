let electron = require('electron'),
    BrowserWindow=electron.BrowserWindow,
    path=require('path');

let window,app=electron.app;

const createWindow=()=>{
  if(window == null){
    window = new BrowserWindow({width: 1000, height: 600})
    window.loadURL('file://'+path.join(__dirname,'index.html'))
    window.on('closed', ()=>window = null);
  }
};
app.on('ready',createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})
app.on('activate', ()=>createWindow());
