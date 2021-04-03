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
            @setCurrSong="registerSongChange"
            :songPlayingState="getSongPlayingState"
            @changeSongPlayState="changeSongPlayState"
            :currentSong="getCurrentSong"
            :newSong="getNewSongLoaded"
            @chgSongLoaded="chgSongLoaded"
          ></songs>
          <!-- <songs
            :playShown="getPlayShownState"
            :pauseShown="getPauseShownState"
          ></songs> -->
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
      ></player>
      <!-- <player
        :playShown="getPlayShownState"
        :pauseShown="getPauseShownState"
      ></player> -->
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
    // getPlayShownState() {
    //   return this.$store.getters.getPlayShownState;
    // },
    // getPauseShownState() {
    //   return this.$store.getters.getPauseShownState;
    // },
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
  },
  methods: {
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
    registerSongChange: function (newSongName) {
      var songDiv = document.getElementById("songContainer");
      for (let i = 0; i < songDiv.childElementCount; i++) {
        if (
          songDiv.children[i].children[1].innerText ==
          newSongName.substring(0, newSongName.length - 4)
        ) {
          this.$store.state.currentSong.element = songDiv.children[i];
          this.$store.state.newSongLoaded = true;
        }
      }
      console.log(
        "Set $store.state.currentSong: ",
        this.$store.state.currentSong
      );

      this.$store.state.currSong = newSongName;
      this.cleanUpSongSelection();
    },
    forwardsBackwardsButton: function (forwardsdOrBackwards) {
      let songDiv = document.getElementById("songContainer");
      let state = this.$store.state;
      let followingSong = null;
      let curSong =
        this.$store.state.currentSong.element.children[1].innerText + ".mp3";

      // Set following song
      if (forwardsdOrBackwards == "forwards") {
        followingSong = this.$store.state.dataFromServ.files[
          Object.keys(this.$store.state.dataFromServ.files).length - 1
        ].name;
      } else if (forwardsdOrBackwards == "backwards") {
        followingSong = state.dataFromServ.files[0].name;
      }

      if (curSong != followingSong) {
        // console.log("Songs are different, can switch");

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
          state.currentSong.element = songDiv.children[currentSongIndex + 1];
        } else if (forwardsdOrBackwards == "backwards") {
          state.currentSong.element = songDiv.children[currentSongIndex - 1];
        }

        if (state.songPlaying == false) {
          state.songChanged = true;
        } else {
          state.songChanged = false;
        }
        // state.currentSong.playShown = true;
        // state.currentSong.pauseShown = false;

        console.log("The following song: ", state.currentSong.element);

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
      } else {
        console.log("Can't switch!");
      }
    },
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
  height: calc(100% - 100px);
  width: calc(100% - 150px);
  min-width: 550px;
  position: absolute;
  top: 100px;
}
#playerDiv {
  height: 200px;
  max-height: 200px;
  min-height: 200px;
  width: 100%;
  min-width: 900px;
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
  margin-left: 150px;
  /* background-color: pink; */
  height: 100%;
  width: calc(100% - 150px);
  min-width: 550px;
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
