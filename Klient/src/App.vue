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
            @getPlayState="getSongPlayingState"
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
      this.$store.state.currSong = newSongName;
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: auto;
  width: 100%;
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
}
</style>
