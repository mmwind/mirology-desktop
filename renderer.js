// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

window.onload = function() {
  const {remote} = require('electron');
  const {BrowserWindow} = remote;
  const win = BrowserWindow.getFocusedWindow();
  document.getElementById("close-window-button").onclick = function() {
    win.close();
  }
  
}