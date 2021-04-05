<template>
  <div class="song" @click="songClicked">
    <div class="songAlbum">
      {{ currSong.album }}
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
      <i class="fas fa-play fa-2x" v-if="showPlayInComp"></i>
      <i class="fas fa-pause fa-2x" v-if="showPauseInComp"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "Songs",
  props: [
    "currSong",
    "songPlayingState",
    "currentSong",
    "newSong",
    "intervalSet",
  ],
  watch: {
    songPlayingState: function () {
      // console.log(`Prop changed from: ${oldVal} to: ${newVal}`);
      // if (this.$el.attributes[0] != this.currentSong.element.attributes[0]) {
      //   }
      if (this.showPauseInComp) {
        this.chgBtnDisplay();
      }
    },
  },
  methods: {
    chgBtnDisplay: function () {
      if (this.$el.attributes[0] == this.currentSong.element.attributes[0]) {
        if (this.songPlayingState) {
          this.showPlayInComp = false;
          this.showPauseInComp = true;
        } else if (!this.songPlayingState) {
          this.showPlayInComp = true;
          this.showPauseInComp = false;
        }
      }
    },
    songClicked: function () {
      this.markSongClicked();
      if (this.$el.style.backdropFilter == "") {
        this.$el.style.backdropFilter = "brightness(80%)";
      }
      // console.log(
      //   `U clicked a song ${this.currSong.name} in an album ${this.currAlbumName} `
      // );
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
      let audio = document.getElementById("audio");
      console.log("PlayAudio", this.currentSong.element);
      console.log(this.currentSong.element != this.$el);
      console.log(this.$el);
      if (
        this.currentSong.element != this.$el ||
        (this.currentSong.first && this.newSong)
      ) {
        this.$emit("setCurrAlbumName", this.currSong.album);
        this.$emit("registerSongChange", this.currSong.name);

        audio.load();
        this.currentSong.first = false;
        this.$emit("chgSongLoaded", false);
      }
      if (!this.songPlayingState) {
        audio.play();
        this.$emit("changeSongPlayState", true);

        audio.onloadeddata = function (e) {
          this.$emit("songLoadedRange", e.target.duration);
          this.$emit("songTimeUpdate", audio.currentTime);
        }.bind(this);

        if (!this.intervalSet) {
          this.$emit("intervalSet", true);
          setInterval(() => {
            this.$emit("songTimeUpdate", audio.currentTime);
          }, 950);
        }
      } else {
        audio.pause();
        this.$emit("changeSongPlayState", false);
      }
      setTimeout(() => {
        this.chgBtnDisplay();
      }, 50);
    },
    comboFunction() {
      this.playAudio();
    },
    setCurrAlbumName: function () {
      this.$emit("setCurrAlbumName", this.currSong.album);
    },
  },
  data: function () {
    return {
      elClicked: false,
      showPlayInComp: true,
      showPauseInComp: false,
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
  width: 90%;
  margin: 3px;
  transition: backdrop-filter 0.5s;
  border-radius: 5px;
}
.song > div {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.song:hover {
  backdrop-filter: brightness(90%);
  cursor: pointer;
}
.song:hover > .playSong {
  display: flex;
  opacity: 1;
}
.song:hover > .playSong > i {
  display: flex;
}
.songAlbum {
  width: 25%;
  height: 100%;
}
.songName {
  height: 100%;
  width: 50%;
  color: #0000ff;
}
.songSize {
  height: 100%;
  width: 25%;
}
.playSong {
  height: 50px;
  width: 50px;
  display: none;
  /* opacity: 0; */
  transition: opacity 0.5s;

  /* background-color: red; */
}
.playSong > i {
  /* display: none; */
  display: flex;
  /* background-color: green; */
}
.fa-play,
.fa-pause {
  color: grey;
}
</style>
