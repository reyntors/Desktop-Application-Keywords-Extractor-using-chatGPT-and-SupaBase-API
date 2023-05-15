
// Imported Modules
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const axios = require('axios');
const dotenv = require('dotenv').config();

// Main Window
const isDev = false;
const isMac = process.platform === 'darwin';
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'App Logs',
        click: logsWindow
      }
    ]
  }
];
const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 800,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
};

// Application Logs Window
function logsWindow () {
  const logs = new BrowserWindow({
    width: 900,
    height: 600,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  logs.setMenuBarVisibility(false);

  if (isDev) {
    logs.webContents.openDevTools();
  }

  logs.loadFile(path.join(__dirname, "./renderer/logs.html"));
}

app.whenReady().then(() => {
  //Initialize Functions
  ipcMain.handle('axios.openAI', openAI);
  ipcMain.handle('axios.supaBase', supaBase);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

 //Main Functions
async function openAI(event, sentence){

 let result = null;

 const env = dotenv.parsed;
  
 await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data: {
      model: "text-davinci-003",
      prompt: "Extract keywords from this text:\n\n" + sentence,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.8,
      presence_penalty: 0.0
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + env.APIKEY_OPENAI
    }

  }).then(function (response){
    result = response.data;
  })
  .catch(function (error){
    result = error;
  });
    
  return result;
}
// Axios Supabase API
async function supaBase(event, method, id = '', data = ''){
  let result = null;
  const env = dotenv.parsed;

  let query = ( method == 'get' ? '?select=*' : (method == 'delete' ? '?prompt_id=eq.' + id : '') );
  await axios({
      method: method,
      url: 'https://lfiafntvzjdwsvufopor.supabase.co/rest/v1/prompts' + query,
      headers: ( method == 'post' ? {
          'apikey': env.APIKEY_SUPABASE,
          'Authorization': 'Bearer ' + env.APIKEY_SUPABASE,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        } : {
          'apikey': env.APIKEY_SUPABASE,
          'Authorization': 'Bearer ' + env.APIKEY_SUPABASE 
        } ),
      data: ( method == 'post' ? data : null )
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}