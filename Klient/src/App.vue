<template>
  <div id="app">
    <div id="songDiv">
      <div id="albums">
        <albums
          v-for="album in getFirstFetchData.albums"
          :key="album"
          :currAlbum="album"
          @imageClicked="registerClick"
        ></albums>
      </div>
      <div id="songs">
        <div id="title">WEBPLAYER</div>
        <div id="songContainer" v-if="!showPlaylist">
          <songs
            v-for="song in getFirstFetchData.files"
            :key="song.name"
            :currSong="song"
            :currAlbumName="getCurrAlbumName"
            @setCurrSong="registerSongChange"
            :songPlayingState="getSongPlayingState"
            @changeSongPlayState="changeSongPlayState"
            :currentSong="getCurrentSong"
            :newSong="getNewSongLoaded"
            @chgSongLoaded="chgSongLoaded"
            @songLoadedRange="songLoadedRange"
            @songTimeUpdate="songTimeUpdate"
            @intervalSet="intervalSet"
            :intervalSet="getIfIntervalSet"
            @addSongToPlaylist="addSongToPlaylist"
            @displayPlaylist="displayPlaylist"
          ></songs>
        </div>
        <div id="songContainer" v-if="showPlaylist">
          <playlist
            v-for="song in getPlaylistSongs"
            :key="song.name"
            :currSong="song"
            @setCurrSong="registerSongChange"
            @setCurrAlbumName="setCurrAlbumName"
            :songPlayingState="getSongPlayingState"
            @changeSongPlayState="changeSongPlayState"
            :currentSong="getCurrentSong"
            :newSong="getNewSongLoaded"
            @chgSongLoaded="chgSongLoaded"
            @songLoadedRange="songLoadedRange"
            @songTimeUpdate="songTimeUpdate"
            @intervalSet="intervalSet"
            :intervalSet="getIfIntervalSet"
          ></playlist>
        </div>
      </div>
    </div>
    <div id="playerDiv">
      <player
        :currAlbum="getCurrAlbumName"
        :currSong="getCurrSongName"
        @nextSong="forwardsBackwardsButton('forwards')"
        @previousSong="forwardsBackwardsButton('backwards')"
        :songPlayingState="getSongPlayingState"
        @changeSongPlayState="changeSongPlayState"
        :currentSong="getCurrentSong"
        :songChanged="getIfSongChanged"
        :newSong="getNewSongLoaded"
        @chgSongLoaded="chgSongLoaded"
        @songLoadedRange="songLoadedRange"
        @songTimeUpdate="songTimeUpdate"
        :currSongTime="getcurrSongTime"
        :songDuration="getcurrSongDuration"
        @playSongFromNow="playSongFromNow"
        @intervalSet="intervalSet"
        :intervalSet="getIfIntervalSet"
        @displayPlaylist="displayPlaylist"
      ></player>
    </div>
  </div>
</template>

<script>
import Songs from "./components/Songs.vue";
import Albums from "./components/Albums.vue";
import Player from "./components/Player.vue";
import Playlist from "./components/Playlist.vue";

export default {
  name: "App",
  components: {
    Songs,
    Albums,
    Player,
    Playlist,
  },
  created() {
    // Make a fetch, get a list of songs
    this.$store.dispatch("firstFetch");
  },
  computed: {
    getFirstFetchData() {
      return this.$store.getters.getFirstFetchData;
    },
    getCurrAlbumName() {
      return this.$store.getters.getCurrAlbumName;
    },
    getCurrSongName() {
      return this.$store.getters.getCurrSongName;
    },
    getSongPlayingState() {
      return this.$store.getters.getSongPlayingState;
    },
    getCurrentSong() {
      return this.$store.getters.getCurrentSong;
    },
    getIfSongChanged() {
      return this.$store.getters.getIfSongChanged;
    },
    getNewSongLoaded() {
      return this.$store.getters.getNewSongLoaded;
    },
    getcurrSongTime() {
      return this.$store.getters.getcurrSongTime;
    },
    getcurrSongDuration() {
      return this.$store.getters.getcurrSongDuration;
    },
    getIfIntervalSet() {
      return this.$store.getters.getIfIntervalSet;
    },
    // Playlist getters
    getPlaylistSongs() {
      return this.$store.getters.getPlaylistSongs;
    },
  },
  methods: {
    // Register album change
    registerClick: function (childAlbum) {
      if (this.$store.state.songPlaying) {
        document.getElementById("audio").pause();
        this.changeSongPlayState(false);
      }
      this.$store.state.currAlbum = childAlbum;

      this.$store.dispatch("getAlbums", childAlbum);
      setTimeout(() => {
        this.registerSongChange(this.$store.state.dataFromServ.files[0].name);
        document.getElementById("audio").load();
      }, 50);
    },
    // Registers song change
    registerSongChange: function (newSongName) {
      var songDiv = document.getElementById("songContainer");
      for (let i = 0; i < songDiv.childElementCount; i++) {
        if (
          songDiv.children[i].children[1].innerText ==
          newSongName.substring(0, newSongName.length - 4)
        ) {
          this.$store.state.currentSong.element = songDiv.children[i];
          this.$store.state.newSongLoaded = true;
          break;
        }
      }
      this.$store.state.currSong = newSongName;
      this.cleanUpSongSelection();
    },
    // Handles player's forwards/backwards buttons
    forwardsBackwardsButton: function (forwardsdOrBackwards) {
      if (!this.showPlaylist) {
        if (this.$store.state.currSong != "Song name      ") {
          let songDiv = document.getElementById("songContainer");
          let state = this.$store.state;
          let followingSong = null;
          let curSong =
            this.$store.state.currentSong.element.children[1].innerText +
            ".mp3";

          // Set following song
          if (forwardsdOrBackwards == "forwards") {
            followingSong = this.$store.state.dataFromServ.files[
              Object.keys(this.$store.state.dataFromServ.files).length - 1
            ].name;
          } else if (forwardsdOrBackwards == "backwards") {
            followingSong = state.dataFromServ.files[0].name;
          }

          if (curSong != followingSong) {
            // Clear song progress display
            document.getElementById("audio").value = 0;
            this.$store.state.songCurrTime = 0;

            // Get the index of a current song
            let currentSongIndex = null;
            for (let i = 0; i < songDiv.childElementCount; i++) {
              if (songDiv.children[i] == state.currentSong.element) {
                currentSongIndex = i;
                break;
              }
            }

            // Set the following song as a current one
            if (forwardsdOrBackwards == "forwards") {
              state.currentSong.element =
                songDiv.children[currentSongIndex + 1];
            } else if (forwardsdOrBackwards == "backwards") {
              state.currentSong.element =
                songDiv.children[currentSongIndex - 1];
            }

            if (state.songPlaying == false) {
              state.songChanged = true;
            } else {
              state.songChanged = false;
            }

            state.currSong =
              state.currentSong.element.children[1].innerText + ".mp3";

            // Play audio
            ///// Start playing next one if play button was hit
            let songCurerntlPlaying = this.getSongPlayingState;
            if (songCurerntlPlaying) {
              document.getElementById("audio").pause();
              document.getElementById("audio").load();
              document.getElementById("audio").play();
            }
            this.cleanUpSongSelection();

            // Change current song display
          }
        } else {
          alert("Wybierz piosenkę!");
        }
      } else {
        if (this.$store.state.currSong != "Song name      ") {
          let songDiv = document.getElementById("songContainer");
          let state = this.$store.state;
          let followingSong = null;
          let curSong =
            this.$store.state.currentSong.element.children[1].innerText +
            ".mp3";

          // Set following song
          if (forwardsdOrBackwards == "forwards") {
            followingSong = this.$store.state.playlistSongs[
              Object.keys(this.$store.state.playlistSongs).length - 1
            ].name;
          } else if (forwardsdOrBackwards == "backwards") {
            followingSong = state.playlistSongs[0].name;
          }

          if (curSong != followingSong) {
            // Clear song progress display
            document.getElementById("audio").value = 0;
            this.$store.state.songCurrTime = 0;

            // Get the index of a current song
            let currentSongIndex = null;
            for (let i = 0; i < songDiv.childElementCount; i++) {
              if (songDiv.children[i] == state.currentSong.element) {
                currentSongIndex = i;
                break;
              }
            }

            // Set the following song as a current one
            if (forwardsdOrBackwards == "forwards") {
              state.currentSong.element =
                songDiv.children[currentSongIndex + 1];
              this.setCurrAlbumName(
                songDiv.children[currentSongIndex + 1].children[0].innerText
              );
            } else if (forwardsdOrBackwards == "backwards") {
              state.currentSong.element =
                songDiv.children[currentSongIndex - 1];
              this.setCurrAlbumName(
                songDiv.children[currentSongIndex - 1].children[0].innerText
              );
            }

            if (state.songPlaying == false) {
              state.songChanged = true;
            } else {
              state.songChanged = false;
            }

            state.currSong =
              state.currentSong.element.children[1].innerText + ".mp3";

            // Play audio
            ///// Start playing next one if play button was hit
            let songCurerntlPlaying = this.getSongPlayingState;
            if (songCurerntlPlaying) {
              document.getElementById("audio").pause();
              document.getElementById("audio").load();
              document.getElementById("audio").play();
            }
            this.cleanUpSongSelection();

            // Change current song display
          }
        } else {
          alert("Wybierz piosenkę!");
        }
      }
    },
    // Ensures, that current song is highlighted
    cleanUpSongSelection: function () {
      var songDiv = document.getElementById("songContainer");
      for (let i = 0; i < songDiv.childElementCount; i++) {
        if (songDiv.children[i] != this.$store.state.currentSong.element) {
          songDiv.children[i].style.backdropFilter = "";
        } else {
          songDiv.children[i].style.backdropFilter = "brightness(80%)";
        }
      }
    },
    changeSongPlayState: function (valueToChangeTo) {
      this.$store.state.songPlaying = valueToChangeTo;
    },
    chgSongLoaded: function (valueToChangeTo) {
      this.$store.state.songChanged = valueToChangeTo;
    },
    // Sets song duration to a timer
    songLoadedRange: function (audioDuration) {
      let timeDisplayInput = document.getElementById("timeDisplay");

      this.$store.state.songDuration = Math.floor(audioDuration);
      timeDisplayInput.setAttribute("max", this.$store.state.songDuration);
      timeDisplayInput.setAttribute("step", 0.0001);
    },
    // Updates current song time
    songTimeUpdate: function (currentTime) {
      let timeDisplayInput = document.getElementById("timeDisplay");

      this.$store.state.songCurrTime = currentTime;
      timeDisplayInput.value = this.$store.state.songCurrTime;
    },
    // Continues playing a song from given point
    playSongFromNow: function (whereToStartFrom) {
      this.$store.state.songCurrTime = whereToStartFrom;

      if (this.$store.state.songPlaying) {
        document.getElementById("audio").play();
      }
    },
    intervalSet: function () {
      this.$store.state.intervalSet = true;
    },
    // Playlist handling
    addSongToPlaylist: function (currentAlbum, currentSongObj) {
      this.$store.dispatch(
        "addSongToPlaylist",
        JSON.stringify({ album: currentAlbum, song: currentSongObj })
      );
    },
    displayPlaylist: function () {
      let state = this.$store.state;
      state.currSong = "Song name      ";
      state.currentSong.element = "";
      state.currentSong.first = true;
      state.songDuration = null;
      state.songCurrTime = null;
      state.songPlaying = false;
      state.songChanged = true;
      state.intervalSet = false;
      document.getElementById("audio").currentTime = 0;
      document.getElementById("timeDisplay").value = 0;
      document.getElementById("timeDisplay").max = 100;

      this.showPlaylist = !this.showPlaylist;
      this.$store.dispatch("getPlaylist");
    },
    setCurrAlbumName: function (nameToSet) {
      this.$store.state.currAlbum = nameToSet;
    },
  },
  data() {
    return {
      showPlaylist: false,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#songDiv {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: 100%;
  position: absolute;
  height: calc(100% - 200px);
}
#songContainer {
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: auto;
  height: calc(100% - 100px);
  width: calc(100% - 150px);
  min-width: 550px;
  position: absolute;
  top: 100px;
  color: #a5a5a5;
}
#playerDiv {
  height: 200px;
  max-height: 200px;
  min-height: 200px;
  width: 100%;
  min-width: 900px;
  background-color: #3500d3;
  position: absolute;
  bottom: 0;
  color: #a5a5a5;
}
#albums {
  background-color: #4003f7;
  width: 150px;
  height: 100%;
  overflow: auto;
  position: absolute;
  left: 0;
}
#songs {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-left: 150px;
  height: 100%;
  width: calc(100% - 150px);
  min-width: 550px;
  background-color: #282828;
}
#title {
  height: 50px;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 69px;
  margin-top: 27px;
  color: #0072ff;
  position: absolute;
  top: 0;
}
</style>
