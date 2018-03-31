const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// require ElectronViewRenderer
const ElectronViewRenderer = require('electron-view-renderer')

const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))
const url = require('url')
var markdown = require( 'markdown' ).markdown
const fs = require('fs');

// To run some functions from another process
const child_process = require('child_process');
// Torrent client
var WebTorrent = require('webtorrent')

// instantiate ElectronViewRenderer with
const viewRenderer = new ElectronViewRenderer({
  viewPath: 'views',            // default 'views'
  viewProtcolName: 'view',      // default 'view'
  useAssets: true,               // default false
  assetsPath: 'assets',          // default 'assets'
  assetsProtocolName: 'asset'   // default 'asset'
})
viewRenderer.use('ejs')
	
// Articles data	
var data;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: 'lightgray',
		title: config.productName,
		webPreferences: {
		  nodeIntegration: true,
		  defaultEncoding: 'UTF-8'
		},
		frame: false
  })
  data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  viewRenderer.load(mainWindow, 'index', {articles: data.articles})
  
  // and load the index.html of the app.
  // in case of static page
  /*mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))*/

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('request-explore', (event, arg) => {
	child_process.exec('start "" "."');
});

// Start to download torrent
ipcMain.on('request-download', (event, arg) => {
	console.log('  Try to add torrent  ');
	var magnetURI = "./cache/1.torrent";
	var torrentClient = new WebTorrent();
	torrentClient.add(magnetURI, { path: './data/1/' }, function (torrent) {
		console.log(
          'Torrent ' + torrent.name + ' was added'
        );
		
		// Print out progress every 5 seconds
        var interval = setInterval(function () {
          console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%, peers: ' + torrent.numPeers)
        }, 5000);
		console.log(
          'Timer must bew ok'
        );
		
		event.sender.send('download-begin','');
	  torrent.on('done', function () {
		//clearInterval(interval);
		event.sender.send('download-end','');
		console.log('torrent download finished')
	  });
	});
});