			window.onload = function() {
			  const {remote} = require('electron');
			  const {BrowserWindow} = remote;
			  const win = BrowserWindow.getFocusedWindow();
			  document.getElementById("close-window-button").onclick = function() {
				win.close();
			  }
			  var ipc = require('electron').ipcRenderer;
			  
			  const button = document.getElementById('ExploreButton');
			  button.addEventListener('click', function(e) {
				ipc.send('request-explore', '');
			  });	
			  const buttonTorrent = document.getElementById('DownloadButton');
			  buttonTorrent.addEventListener('click', function(e) {
				ipc.send('request-download', '');
			  });	
			  
			  ipc.on('download-begin', (event, arg) => {
				buttonTorrent.className = "p-2 downloading-buttons";
				console.log('download-begin');
			  });
			  ipc.on('download-end', (event, arg) => {
				buttonTorrent.className = "p-2 downloaded-buttons";
				console.log('download-end');
			  });
			 }