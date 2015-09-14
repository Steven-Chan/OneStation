var Youtube = require('youtube-api');
var config = require('./config.js');
var ipc = require('ipc');


function runYouTube(id) {
  var t = document.getElementById('yt_audio_url');
  ipc.send('set-videoid', id || t.value);
}

function play () {
  ipc.send('play');
}

function pause () {
  ipc.send('pause');
}

function search () {
  var s = document.getElementById('SearchBar');
  var search = s.value;
  s.value = '';

  Youtube.search.list({
    part: 'snippet',
    maxResults: 5,
    type: 'video',
    fields: 'items(id,snippet)',
    q: search
  }, function(err, result) {
    console.log(err, result);
    if (err === null) {
      var resultDiv = document.getElementById('SearchResult');
      resultDiv.innerHTML = '';

      for (var i = 0; i < result.items.length; i++) {
        var v = result.items[i];
        var div = document.createElement('div');
        div.innerHTML = '<button onclick="runYouTube(\''+ v.id.videoId +'\')">play</button>' + v.snippet.title + ' - ' + v.id.videoId;

        resultDiv.appendChild(div);
      }
    }
  });
}

window.onload = function () {
  audio = new Audio();
  Youtube.authenticate({
    type: 'key',
    key: config['youtube-api-key']
  });
}