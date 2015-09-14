var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var ytdl = require('youtube-dl');
var storage = require('node-persist');

require('crash-reporter').start();

storage.initSync();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var audioWindow = null;

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
  mainWindow.loadUrl('file://' + __dirname + '/main/index.html');

  // Open the DevTools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  audioWindow = new BrowserWindow({width: 1, height: 1, show: false});
  audioWindow.loadUrl('file://' + __dirname + '/audio/index.html');

  ipc.on('set-videoid', function(event, arg) {
    console.log('set-videoid: ', arg);
    getYoutubeAudioLink(arg, function(url, err) {
      audioWindow.webContents.send('set-audiolink', url);
    });
  });

  ipc.on('play', function(event, arg) {
    console.log('play');
    audioWindow.webContents.send('play');
  });

  ipc.on('pause', function(event, arg) {
    console.log('pause');
    audioWindow.webContents.send('pause');
  });
});

var getYoutubeAudioLink = function (link, cb) {
  // var options = ['--username=', '--password='];
  var options = [];
  ytdl.getInfo(link, options, function(err, info) {
    if (err) return cb(undefined, err);
    for (var i = info.formats.length - 1; i >= 0; i--) {
      var format = info.formats[i];
      if (format.format.indexOf('audio only') !== -1) {
        if (format.ext === 'webm') {
          return cb(format.url);
        }
      }
    };
    return cb(undefined, 'not found');
  });
}
