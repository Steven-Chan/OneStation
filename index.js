var ytdl = require('youtube-dl');
var SpotifyWebApi = require('spotify-web-api-node');

// var url = process.argv[2];
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

function runYouTube() {
  var t = document.getElementById('yt_audio_url');
  getYoutubeAudioLink(t.value, function(url, err) {
    // var a = document.getElementById('AudioPlayer');
    // a.src = url;
    // a.play();
    var a = new Audio();
    a.src = url;
    a.play();
  });
}

function runSpotify() {
  var t = document.getElementById('spotify_audio_url');
  var s = document.getElementById('SpotifyPlayer');
  s.src = "https://embed.spotify.com/?uri=spotify%3Atrack%3A" + t.value;
  s.onload = function() {
    console.log('onload');
    s.onload = undefined;
  }
}

function play () {
  var s = document.getElementById('SpotifyPlayer');
  // s.contentDocument.getElementsByClassName('clickable')[0].click();
  s.contentDocument.getElementsByClassName('clickable')[0].click();
}

function pause () {

}

window.onload = function () {

}

