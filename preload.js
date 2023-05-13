const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("axios", {
  openAI: () => ipcRenderer.invoke('axios.openAI')
});
