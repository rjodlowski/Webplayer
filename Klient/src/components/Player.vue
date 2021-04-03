<template>
  <div id="main">
    <div id="songName">
      {{ currSong.substring(0, currSong.length - 4) }}
    </div>
    <div id="playerBtns">
      <div id="previousSong" class="arrows" @click="previousClicked">
        <i class="fas fa-arrow-left fa-6x"></i>
      </div>
      <div id="playSong" @click="playAudio">
        <i class="far fa-play-circle fa-8x" v-if="showPlayInComp"></i>
        <i class="far fa-pause-circle fa-8x" v-if="showPauseInComp"></i>
      </div>
      <div id="followingSong" class="arrows" @click="followingClicked">
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
  props: [
    "currAlbum",
    "currSong",
    // "playShown",
    // "pauseShown",
    "songPlayingState",
    "currentSong",
  ],
  // updated() {
  //   console.log(this.songPlayingState);
  // },
  watch: {
    songPlayingState: function () {
      this.chgBtnDisplay();
    },
  },
  methods: {
    chgBtnDisplay: function () {
      if (this.songPlayingState) {
        this.showPlayInComp = false;
        this.showPauseInComp = true;
      } else if (!this.songPlayingState) {
        this.showPlayInComp = true;
        this.showPauseInComp = false;
      }
      // this.$emit("changePlayBtn");
    },
    playAudio: function () {
      document.getElementById("audio").load();
      if (!this.songPlayingState) {
        document.getElementById("audio").play();
        this.$emit("changeSongPlayState", true);
      } else {
        document.getElementById("audio").pause();
        this.$emit("changeSongPlayState", false);
      }
      // this.songPlaying = !this.songPlaying;
      setTimeout(() => {
        this.chgBtnDisplay();
      }, 50);
    },
    previousClicked: function () {
      console.log("Go to previous song");
      this.$emit("previousSong");
    },
    followingClicked: function () {
      console.log("Go to next song");
      this.$emit("nextSong");
    },
  },
  data: function () {
    return {
      songPlaying: false,
      showPlayInComp: true,
      showPauseInComp: false,
    };
  },
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 900px;
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
  background-color: red;
  cursor: pointer;
}
#playSong {
  width: 150px;
  height: 150px;
  background-color: red;
  cursor: pointer;
}
#songName {
  height: 50px;
  position: absolute;
  left: 4%;
  top: 75px;
  display: flex;
  align-items: center;
  width: 22%;
  text-align: center;
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
