<template>
  <div id="main">
    <img
      :src="`http://localhost:3000/albums/${currAlbum}/cover.jpg`"
      @click="registerClickInComp"
    />
  </div>
</template>

<script>
export default {
  name: "Albums",
  props: ["currAlbum"],
  methods: {
    registerClickInComp: function () {
      this.$emit("imageClicked", this.currAlbum);
      this.$emit("cleanCurrentSong");
    },
  },
};
</script>

<style scoped>
#main {
  width: 100%;
  height: 140px;
}
#main > img {
  width: 100%;
  height: 140px;
  cursor: pointer;
}
.albumCover {
  width: 150px;
  height: 150px;
}
</style>
