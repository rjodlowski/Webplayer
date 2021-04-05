import axios from "axios"
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

// State
const state = {
	dataFromServ: {},
	currAlbum: "",

	currentSong: {
		songName: "",
		albumName: "",
		element: "",
		first: true,
	},

	currSong: "Song name      ",
	songPlaying: false,
	songChanged: true,

	// Song progress
	songDuration: null,
	songCurrTime: null,
	intervalSet: false,

	// Playlist
	playlistSongs: [],

}

const getters = {
	getFirstFetchData: function (state) {
		return state.dataFromServ
	},
	getCurrAlbumName: function (state) {
		return state.currAlbum
	},
	getCurrSongName: function (state) {
		return state.currSong
	},
	getSongPlayingState: function (state) {
		return state.songPlaying
	},
	getCurrentSong: function (state) {
		return state.currentSong
	},
	// Song changed
	getNewSongLoaded: function (state) {
		return state.songChanged;
	},
	// Song progress getters
	getcurrSongTime: function (state) {
		return state.songCurrTime
	},
	getcurrSongDuration: function (state) {
		return state.songDuration
	},
	getIfIntervalSet: function (state) {
		return state.intervalSet
	}
}

// Mutations
const mutations = {
	STORE_DATA_FROM_SERV(state, newData) {
		state.dataFromServ = newData
		// console.log(newData.albums);
		state.currAlbum = newData.albums[0]
		// console.log(state.currAlbum);
		console.log("First fetch result object: ", state.dataFromServ);

		// state.currSong = newData.files[0].name
	},
	CHANGE_FILES(state, newData) {
		state.dataFromServ.files = newData.files;
		console.log("Podmieniono piosenki", state.dataFromServ);
	},
	SONG_TO_PLAYLIST(state, newData) {
		state.playlistSongs.push(newData)
		console.log("mutation", state.playlistSongs);
	},
	SAVE_PLAYLIST(state, newData) {
		state.playlistSongs = newData
		console.log("Data addded mutation", state.playlistSongs);
	}
}

// Actions
const actions = {
	firstFetch({ commit }) {
		axios.post("http://localhost:3000/albums", JSON.stringify({ action: "FIRST" }))
			.then(response => {
				commit("STORE_DATA_FROM_SERV", response.data)
			})
	},
	getAlbums({ commit }, albumName) {
		axios.post("http://localhost:3000/albums", JSON.stringify({ action: "NEXT", albumName: albumName }))
			.then(response => {
				commit("CHANGE_FILES", response.data)
			})
	},
	// Handling playlist actions
	addSongToPlaylist({ commit }, songData) {
		axios.post("http://localhost:3000/playlist", JSON.stringify({ action: "ADD_SONG", songData: songData }))
			.then(response => {
				commit("SONG_TO_PLAYLIST", response.data)
			})
	},
	getPlaylist({ commit }) {
		axios.post("http://localhost:3000/playlist", JSON.stringify({ action: "GET_PLAYLIST" }))
			.then(response => {
				commit("SAVE_PLAYLIST", response.data)
			})
	}
}

// Export store
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
})



