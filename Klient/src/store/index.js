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

	currSong: "Song name",
	songPlaying: false,
	songChanged: true,

	// Song progress
	songDuration: null,
	songCurrTime: null,
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
	// getPreviousSong: function (state) {
	// 	return state.previousSong
	// },
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

		state.currSong = newData.files[0].name
	},
	CHANGE_FILES(state, newData) {
		state.dataFromServ.files = newData.files;
		// console.log(state.currAlbum);
		console.log("Podmieniono piosenki", state.dataFromServ);
	},
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
}

// Export store
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
})



