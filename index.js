var ytdl = require('youtube-dl');
var Youtube = require('youtube-api');
var config = require('./config.js');

var audio = null;

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

function runYouTube(id) {
  var t = document.getElementById('yt_audio_url');
  getYoutubeAudioLink(id || t.value, function(url, err) {
    audio.src = url;
    audio.play();
  });
}

function play () {
  audio.play();
}

function pause () {
  audio.pause();
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