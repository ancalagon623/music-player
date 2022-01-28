var createSongRow = function (songNumber, songName, songLength) {
  var template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber +  '  </td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + songLength + '</td>'
   + '</tr>';

  var handleSongClick = function () {
    var clickedSongNumber = $(this).attr('data-song-number');

    //1. If there is a song currently playing, remove its pause button
    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    
    //2. If a song is playing other than the one clicked OR no song is playing: set the song number to new song, display the pause button on the clicked song, and set a new song to play.
    if (clickedSongNumber !== currentlyPlayingSongNumber) {

      currentlyPlayingSongNumber = clickedSongNumber;
      setSong(songNumber);
      currentSoundFile.play();
      $(this).html(pauseButtonTemplate);

      // 3. Otherwise there is a currently playing song and it was clicked. Now no song should be playing.
    } else {
      currentlyPlayingSongNumber = null;
      $(this).html(clickedSongNumber);
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
  var songURL = currentAlbum.songs[currentlyPlayingSongNumber - 1].audioURL;

  currentSoundFile = new buzz.sound(songURL, {
    formats: [ 'mp3' ],
    preload: true,
  });
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSongNumber = null;
var currentSoundFile = null;
var currentAlbum = null;

setCurrentAlbum(albums[0]);