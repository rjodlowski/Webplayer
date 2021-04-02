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
        <div id="songContainer">
          <songs
            v-for="song in getFirstFetchData.files"
            :key="song.name"
            :currSong="song"
            :currAlbumName="getCurrAlbumName"
            :playShown="getPlayShownState"
            :pauseShown="getPauseShownState"
            @changePlayBtn="registerPlayBtnChg"
            @setCurrSong="registerSongChange"
          ></songs>
        </div>
      </div>
    </div>
    <div id="playerDiv">
      <player
        :currAlbum="getCurrAlbumName"
        :currSong="getCurrSongName"
        :playShown="getPlayShownState"
        :pauseShown="getPauseShownState"
        @changePlayBtn="registerPlayBtnChg"
        @nextSong="playNextSong"
        @previousSong="playPreviousSong"
      ></player>
    </div>
  </div>
</template>

<script>
import Songs from "./components/Songs.vue";
import Albums from "./components/Albums.vue";
import Player from "./components/Player.vue";

export default {
  name: "App",
  components: {
    Songs,
    Albums,
    Player,
  },
  created() {
    // Make a fetch, get a list of songs
    this.$store.dispatch("firstFetch");

    // Set first song in first album as a current song
    // Target: called after first fetch ended
    setTimeout(() => {
      this.registerSongChange(this.$store.state.currSong);
    }, 100);
  },
  computed: {
    getFirstFetchData() {
      return this.$store.getters.getFirstFetchData;
    },
    getCurrAlbumName() {
      return this.$store.getters.getCurrAlbumName;
    },
    getPlayShownState() {
      return this.$store.getters.getPlayShownState;
    },
    getPauseShownState() {
      return this.$store.getters.getPauseShownState;
    },
    getCurrSongName() {
      return this.$store.getters.getCurrSongName;
    },
    getSongPlayingState() {
      return this.$store.getters.getSongPlayingState;
    },
  },
  methods: {
    registerClick: function (childAlbum) {
      this.$store.state.currAlbum = childAlbum;

      this.$store.dispatch("getAlbums", childAlbum);
    },
    registerPlayBtnChg: function () {
      this.$store.state.playShown = !this.$store.state.playShown;
      this.$store.state.pauseShown = !this.$store.state.pauseShown;
    },
    registerSongChange: function (newSongName) {
      var songDiv = document.getElementById("songContainer");
      for (let i = 0; i < songDiv.childElementCount; i++) {
        if (
          songDiv.children[i].children[1].innerText ==
          newSongName.substring(0, newSongName.length - 4)
        ) {
          this.$store.state.currentSong.element = songDiv.children[i];
        }
      }
      console.log(
        "Set $store.state.currentSong: ",
        this.$store.state.currentSong
      );

      this.$store.state.currSong = newSongName;
    },
    playNextSong: function () {
      let state = this.$store.state;
      let songDiv = document.getElementById("songContainer");
      let curSong =
        this.$store.state.currentSong.element.children[1].innerText + ".mp3";
      let lastSong = this.$store.state.dataFromServ.files[
        Object.keys(this.$store.state.dataFromServ.files).length - 1
      ].name;

      if (curSong != lastSong) {
        console.log("Songs are different, can go forwards");

        // if audio is playing, stop it

        ///// get the index of a current song
        let currentSongIndex = null;
        for (let i = 0; i < songDiv.childElementCount; i++) {
          if (songDiv.children[i] == state.currentSong.element) {
            currentSongIndex = i;
            break;
          }
        }
        // set the next song as a current one
        state.currentSong.element = songDiv.children[currentSongIndex + 1];
        state.currentSong.playShown = true;
        state.currentSong.pauseShown = false;
        console.log("The previous song: ", state.currentSong.element);
        // play audio
        state.currSong =
          state.currentSong.element.children[1].innerText + ".mp3";
        // Change current song display
      } else {
        console.log("Can't go forwards!");
      }
    },
    playPreviousSong: function () {
      // if a song is not the first one in an album
      // set current song the previous one
      //// communication between components???
      // auto play freshly selected song

      // var songDiv = document.getElementById("songContainer");
      let state = this.$store.state;
      let songDiv = document.getElementById("songContainer");

      let curSong = state.currentSong.element.children[1].innerText + ".mp3";
      let firstSong = state.dataFromServ.files[0].name;

      if (curSong != firstSong) {
        console.log("Songs are different, can go back");
        // if audio is playing, stop it

        ///// get the index of a current song
        let currentSongIndex = null;
        for (let i = 0; i < songDiv.childElementCount; i++) {
          if (songDiv.children[i] == state.currentSong.element) {
            currentSongIndex = i;
            break;
          }
        }
        // set the next song as a current one
        state.currentSong.element = songDiv.children[currentSongIndex - 1];
        state.currentSong.playShown = true;
        state.currentSong.pauseShown = false;
        console.log("The previous song: ", state.currentSong.element);
        // play audio
        state.currSong =
          state.currentSong.element.children[1].innerText + ".mp3";
        // Change current song display
      } else {
        console.log("Can't go back!");
      }
    },
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
  /* background-color: red; */
  position: absolute;
  height: calc(100% - 200px);
}
#songContainer {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  overflow: auto;
  width: calc(100% - 150px);
  position: absolute;
  top: 100px;
  height: calc(100% - 100px);
}
#playerDiv {
  height: 200px;
  max-height: 200px;
  min-height: 200px;
  width: 100%;
  min-width: 800px;
  background-color: blue;
  position: absolute;
  bottom: 0;
  color: white;
}
#albums {
  background-color: green;
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
  /* flex-grow: 1; */
  height: 100%;
  /* background-color: pink; */
  min-width: 350px;
  width: calc(100% - 150px);
  margin-left: 150px;
}
#title {
  height: 50px;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  margin: 15px;
  color: #4b4bff;
  position: absolute;
  top: 0;
}
</style>
