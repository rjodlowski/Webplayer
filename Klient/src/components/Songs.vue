<template>
  <div id="main">
    <div id="songContainer">
      <div class="song" v-for="song in fetchData.files" :key="song.name">
        <div class="songAlbum">
          {{ currAlbumName }}
        </div>
        <div class="songName">
          {{ song.name }}
        </div>
        <div class="songSize">
          Size:
          {{ (song.size / 1048576).toString().substring(0, 4) }}
          MB
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Songs",
  props: ["fetchData", "currAlbumName"],
};
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#songContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

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
</style>
