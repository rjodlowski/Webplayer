<template>
  <div id="main">
    <div id="songName">
      {{ currSong.substring(0, currSong.length - 4) }}
    </div>
    <div id="timer">
      <div id="currentTime">
        {{ Math.floor(currSongTime / 60) }}:{{
          (Math.floor(currSongTime) % 60).toString().length == 2
            ? Math.floor(currSongTime) % 60
            : `0${Math.floor(currSongTime) % 60}`
        }}
      </div>
      <div id="spacer">{{ spacer }}</div>
      <div id="duration">
        {{ Math.floor(songDuration / 60) }}:{{
          (Math.floor(songDuration) % 60).toString().length == 2
            ? Math.floor(songDuration) % 60
            : `0${Math.floor(songDuration) % 60}`
        }}
      </div>
    </div>
    <div id="playlist" @click="showMePlaylist">
      <i class="fab fa-itunes-note fa-2x"></i>
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
    <input
      type="range"
      id="timeDisplay"
      min="0"
      max="512"
      value="0"
      @click="playSongFromNowComp"
    />
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
    "songPlayingState",
    "currentSong",
    "newSong",
    "currSongTime",
    "songDuration",
    "intervalSet",
  ],
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
    },
    playAudio: function () {
      let audio = document.getElementById("audio");
      if (this.currentSong.element != "") {
        if (this.newSong) {
          document.getElementById("audio").load();
          this.$emit("chgSongLoaded", false);
        }
        if (!this.songPlayingState) {
          document.getElementById("audio").play();
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
          document.getElementById("audio").pause();
          this.$emit("changeSongPlayState", false);
        }
        setTimeout(() => {
          this.chgBtnDisplay();
        }, 50);
      } else {
        alert("Wybierz utwór!");
      }
    },
    previousClicked: function () {
      this.$emit("previousSong");
    },
    followingClicked: function () {
      this.$emit("nextSong");
    },
    playSongFromNowComp: function (event) {
      document.getElementById("audio").pause();
      let storedTime = event.target.value;
      document.getElementById("audio").currentTime = storedTime;
      this.$emit("playSongFromNow", storedTime);
    },
    showMePlaylist: function () {
      this.$emit("displayPlaylist");
    },
  },
  data: function () {
    return {
      songPlaying: false,
      showPlayInComp: true,
      showPauseInComp: false,
      spacer: "/",
    };
  },
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  cursor: pointer;
}
#playSong {
  width: 150px;
  height: 150px;
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
#timer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 4%;
  height: 50px;
  width: 190px;
  text-align: center;
  font-size: 45px;
}
#timeDisplay {
  width: 700px;
  height: 25px;
  -webkit-appearance: none;
  border-radius: 5px;
  background: #282828;
  outline: none;
}

#timeDisplay::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #0072ff;
  cursor: pointer;
}

#timeDisplay::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #0072ff;
  cursor: pointer;
}
.fa-arrow-right,
.fa-arrow-left,
.fa-play-circle,
.fa-pause-circle,
.fa-itunes-note {
  color: #a5a5a5;
}
#audio {
  display: none;
}
#playlist {
  height: 50px;
  width: 150px;
  background-color: #240090;
  position: absolute;
  top: 15px;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
}
#playlist:hover {
  cursor: pointer;
}
</style>
