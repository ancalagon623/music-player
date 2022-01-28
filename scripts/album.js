var createSongRow = function (songNumber, songName, songLength) {
  var template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber +  '  </td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + songLength + '</td>'
   + '</tr>';

  var handleSongClick = function () {
    var clickedSongNumber = $(this).attr('data-song-number');

    //1. If there is a song currently playing, reset its pause button to its number
    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    
    //2. If a song is playing other than the one clicked OR no song is playing:
    if (clickedSongNumber !== currentlyPlayingSongNumber) {
      currentlyPlayingSongNumber = clickedSongNumber;
      // if (!pausedSong) {
      //   setSong(songNumber);
      // } 
      setSong(songNumber);
      currentSoundFile.play();
      $(this).html(pauseButtonTemplate);

      // 3. Otherwise there is a currently playing song and it was clicked. 
    } else {
      // pausedSong = currentlyPlayingSongNumber;
      // currentlyPlayingSongNumber = null;
      if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
      } else {
        currentSoundFile.pause();
        $(this).html(playButtonTemplate);
      }
      
    }
  };

  var onHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');

    if (songNumber !== currentlyPlayingSongNumber) {
      songItem.html(playButtonTemplate);
    }
  };
  

  var offHover = function () {
    
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');
    
    if (songNumber !== currentlyPlayingSongNumber) {
      songItem.html(songNumber);
    }
  };

  var $row = $(template);

  $row.find('.song-item-number').click(handleSongClick);
  $row.hover(onHover, offHover);

  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $songRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($songRow);
  }
};

var setSong = function (songNumber) {
  
  var $songName = $('.song-name');
  var $songArtist = $('.artist-name');
  var $totalTime = $('.total-time');

  var songLength = currentAlbum.songs[songNumber - 1].duration;
  var extraZero = songLength % 60 < 10 ? '0' : '';

  $songName.text(currentAlbum.songs[songNumber - 1].title);
  $songArtist.text(currentAlbum.artist);
  $totalTime.text(Math.floor(songLength / 60) + ':' + extraZero + songLength % 60);
  
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  var songUrl = currentAlbum.songs[currentlyPlayingSongNumber - 1].audioUrl;

  currentSoundFile = new buzz.sound(songUrl, {
    formats: [ 'mp3' ],
    preload: true,
  }); 
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSongNumber = null;
var currentSoundFile = null;
var currentAlbum = null;
// var pausedSong = null;

setCurrentAlbum(albums[0]);