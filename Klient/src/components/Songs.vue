<template>
  <div class="song" @click="songClicked">
    <div class="songAlbum">
      {{ currAlbumName }}
    </div>
    <div class="songName">
      {{ currSong.name.substring(0, currSong.name.length - 4) }}
    </div>
    <div class="songSize">
      Size:
      {{ (currSong.size / 1048576).toString().substring(0, 4) }}
      MB
    </div>
    <div class="playSong" @click="playAudio">
      <i class="fas fa-play fa-2x" v-if="playShown" @click="chgMiniPlayBtn"></i>
      <i
        class="fas fa-pause fa-2x"
        v-if="pauseShown"
        @click="chgMiniPlayBtn"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "Songs",
  props: ["currAlbumName", "currSong", "playShown", "pauseShown"],
  methods: {
    chgMiniPlayBtn: function () {
      this.markSongClicked();
      console.log("xD", this.currAlbumName, this.currSong.name);
      // Set currently playing song
      this.$emit("changePlayBtn");
    },
    songClicked: function () {
      this.markSongClicked();
      console.log(
        `U clicked a song ${this.currSong.name} in an album ${this.currAlbumName} `
      );
      this.$emit("setCurrSong", this.currSong.name);
    },
    markSongClicked: function () {
      if (!this.elClicked) {
        this.$el.style.backdropFilter = "brightness(80%)";
      } else {
        this.$el.style.backdropFilter = "";
      }
      this.elClicked = !this.elClicked;
    },
    playAudio: function () {
      document.getElementById("audio").load();
      if (!this.songPlaying) {
        document.getElementById("audio").play();
      } else {
        document.getElementById("audio").pause();
      }
      this.songPlaying = !this.songPlaying;
    },
  },
  data: function () {
    return {
      elClicked: false,
    };
  },
};
</script>

<style scoped>
.song {
  display: Flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 80%;
  margin: 3px;
  transition: backdrop-filter 0.5s;
  border-radius: 5px;
}
.song:hover {
  backdrop-filter: brightness(90%);
  cursor: pointer;
}
.songAlbum {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 100%;
}
.songName {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
  color: #0000ff;
}
.songSize {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 25%;
}
.playSong {
  height: 50px;
  width: 50px;
  /* background-color: red; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.fa-play,
.fa-pause {
  color: grey;
}
</style>
