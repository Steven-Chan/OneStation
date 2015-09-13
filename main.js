var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
// var SpotifyWebApi = require('spotify-web-api-node');

require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var authWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  authWindow = new BrowserWindow({width: 800, height: 600});
  authWindow.loadUrl('https://accounts.spotify.com/authorize?'+
    'client_id=65d0bb0432a9429ba77734fdbf35e49e&'+
    'redirect_uri=http:%2F%2Flocalhost%2Fcallback&'+
    'scope=playlist-read-private&'+
    'response_type=token');
  authWindow.openDevTools();

  authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl, isMainFrame) {
    console.log('oldUrl ', oldUrl);
    console.log('newUrl ', newUrl);
    authWindow.close();
  });

  authWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    authWindow = null;
  });
});