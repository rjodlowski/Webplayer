<template>
  <div id="main">
    <div id="songName">
      {{ currPlayingSongName }}
    </div>
    <div id="playerBtns">
      <div id="previousSong" class="arrows">
        <i class="fas fa-arrow-left fa-6x"></i>
      </div>
      <div id="playSong">
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
  </div>
</template>

<script>
export default {
  name: "Player",
  props: ["currSong", "playShown", "pauseShown", "currPlayingSongName"],
  methods: {
    previousClicked: function () {},
    followingClicked: function () {},
    playClicked: function () {},
    changePlayBtn: function () {
      this.$emit("changePlayBtn");
    },
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
</style>
