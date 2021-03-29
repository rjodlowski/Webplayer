<template>
  <div id="album">
    <img
      :src="`http://localhost:3000/albums/${currAlbum}/cover.jpg`"
      alt=""
      @click="registerClickInComp"
    />
  </div>
</template>

<script>
export default {
  name: "Albums",
  props: ["currAlbum"],
  methods: {
    getImageUrl: function (folder) {
      return {
        "background-image": `../../static/albums/${folder}/cover.jpg`,
      };
    },
    registerClickInComp: function () {
      this.$emit("imageClicked", this.currAlbum)
    },
  },
  computed: {
    // getAlbumNames() {
    //   // return this.$store.state.dataFromServ.albums;
    // },
  },
};
</script>

<style scoped>
#album > div {
  outline: 1px solid yellow;
}

.albumCover {
  width: 150px;
  height: 150px;
  background-color: red;
}
</style>
