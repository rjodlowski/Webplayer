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
  /* outline: 1px solid yellow; */
  cursor: pointer;
}
.albumCover {
  width: 150px;
  height: 150px;
  background-color: red;
}
</style>
