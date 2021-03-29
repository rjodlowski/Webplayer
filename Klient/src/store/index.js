import axios from "axios"
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

// State
const state = {
	dataFromServ: {},
	currAlbum: "",
}

const getters = {
	getFirstFetchData: function (state) {
		return state.dataFromServ
	},
	getCurrAlbumName: function (state) {
		return state.currAlbum
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
	},
	CHANGE_FILES(state, newData) {
		state.dataFromServ.files = newData.files;
		// console.log(state.currAlbum);
		console.log("Podmieniono piosenki", state.dataFromServ);
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
	}
}

// Export store
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
})



