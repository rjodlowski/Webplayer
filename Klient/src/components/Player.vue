<template>
  <div id="main">
    <div id="songName">
      {{ currSong }}
    </div>
    <div id="playerBtns">
      <div id="previousSong" class="arrows">
        <i class="fas fa-arrow-left fa-6x"></i>
      </div>
      <div id="playSong" @click="playAudio">
        <i
          class="far fa-play-circle fa-8x"
          v-if="playShown"
          @click="changePlayBtn"
        ></i>
        <i
          class="far fa-pause-circle fa-8x"
          v-if="pauseShown"
          @click="changePlayBtn"
        ></i>
      </div>
      <div id="followingSong" class="arrows">
        <i class="fas fa-arrow-right fa-6x"></i>
      </div>
    </div>
    <audio id="audio" controls>
      <source
        :src="`http://localhost:3000/albums/${currAlbum}/${currSong}`"
        id="audio_src"
        type="audio/mp3"
      />
    </audio>
  </div>
</template>

<script>
export default {
  name: "Player",
  props: ["currAlbum", "playShown", "pauseShown", "currSong"],
  methods: {
    previousClicked: function () {},
    followingClicked: function () {},
    playClicked: function () {},
    changePlayBtn: function () {
      this.$emit("changePlayBtn");
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
      songPlaying: false,
    };
  },
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 800px;
  width: 100%;
  height: 100%;
}
#playerBtns {
  display: flex;
  justify-content: center;
  align-items: center;
}
#playerBtns > div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
}
.arrows {
  width: 100px;
  height: 100px;
  /* background-color: red; */
  cursor: pointer;
}
#playSong {
  width: 150px;
  height: 150px;
  /* background-color: red; */
  cursor: pointer;
}
#songName {
  height: 50px;
  position: absolute;
  left: 7%;
  top: 75px;
  display: flex;
  align-items: center;
}
.fa-arrow-right,
.fa-arrow-left,
.fa-play-circle,
.fa-pause-circle {
  color: white;
}
#audio {
  display: none;
}
</style>
