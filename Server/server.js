const PORT = 3000;
const http = require("http")
const fs = require("fs")
const DataStore = require("nedb")

var playlistDB = new DataStore({
	filename: "playlist.db",
	autoload: true,
})

const server = http.createServer(function (req, res) {
	switch (req.method) {
		case "GET":
			if (req.url == "/") {
			} else if (req.url.startsWith("/albums/")) {
				var path = decodeURIComponent(req.url)
				if (req.url.endsWith(".jpg")) {
					fs.readFile("./static" + path, function (error, data) {
						if (error) {
							return console.log(error);
						} else {
							res.writeHead(200, { "Content-Type": 'image/jpeg; charset=utf-8' });
							res.write(data)
							res.end();
						}
					})
				} else if (req.url.endsWith(".mp3")) {
					var stats = fs.statSync("./static" + path)
					fs.readFile("./static" + path, function (error, data) {
						if (error) {
							return console.log(error)
						} else {
							res.writeHead(200, {
								"Content-Type": "audio/mpeg", "Access-Control-Allow-Origin": "*",
								"Content-length": stats.size,
								"Accept-ranges": "bytes"
							})
							res.write(data)
							res.end();
						}
					})
				}
			}
			break;
		case "POST":
			handlePost(req, res)
			break;
	}
})

function handlePost(req, res) {
	var allData = "";

	req.on("data", function (data) {
		allData += data;
	})

	req.on("end", function () {
		var finish = JSON.parse(allData);

		if (finish.action == "FIRST") {
			res.writeHead(200, { "content-type": "application/json", "Access-Control-Allow-Origin": "*" })
			var servRes = {
				info: "first",
				albums: [],
				files: [],
			}

			fs.readdir((__dirname + "/static/albums"), function (err, albums) {
				if (err) {
					return console.log(err);
				} else {
					for (let albumIndex = 0; albumIndex < albums.length; albumIndex++) {
						// Get album names into servRes
						servRes.albums.push(albums[albumIndex])
					}
				}
				// Get file names in directory
				fs.readdir((__dirname + "/static/albums/" + servRes.albums[0]), function (err, files) {
					if (err) {
						return console.log(err)
					} else {
						for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
							if (files[fileIndex].substr(files[fileIndex].length - 4) != ".jpg") {
								let statsSize = fs.statSync(__dirname + "/static/albums/" + servRes.albums[0] + "/" + files[fileIndex]).size;
								let fileInfo = {
									name: files[fileIndex],
									size: statsSize,
								}
								servRes.files.push(fileInfo)
							}
						}
					}
					res.end(JSON.stringify(servRes, null, 4));
				})
			})
		} else if (finish.action == "NEXT") {
			// Send back a list of songs from an album
			res.writeHead(200, { "content-type": "application/json", "Access-Control-Allow-Origin": "*" })
			var servRes = {
				info: "next",
				files: [],
			}

			fs.readdir(__dirname + "/static/albums/" + finish.albumName, function (err, files) {
				if (err) {
					return console.log(err)
				} else {
					for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
						if (files[fileIndex].substr(files[fileIndex].length - 4) != ".jpg") {
							let statsSize = fs.statSync(__dirname + "/static/albums/" + finish.albumName + "/" + files[fileIndex]).size;
							let fileInfo = {
								name: files[fileIndex],
								size: statsSize,
							}
							servRes.files.push(fileInfo)
						}
					}
				}
				res.end(JSON.stringify(servRes, null, 4));
			});

		} else if (finish.action == "ADD_SONG") {
			res.writeHead(200, { "content-type": "application/json", "Access-Control-Allow-Origin": "*" })

			// Prepare a song object to add to the playlist db
			let songDataParsed = JSON.parse(finish.songData)
			songDataParsed.song.album = songDataParsed.album
			let songToAdd = songDataParsed.song

			// Delete all songs from playlist db
			// playlistDB.remove({}, { multi: true }, function (err, numRemoved) {
			// 	if (err) {
			// 		console.log(err);
			// 	} else {
			// 		console.log("Usunięto dokumenty: ", numRemoved);
			// 	}
			// })

			let currDbState = []
			let theresDuplicate = false

			playlistDB.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					currDbState = docs

					for (let i = 0; i < currDbState.length; i++) {
						if (currDbState[i].name == songToAdd.name) {
							theresDuplicate = true
							break;
						}
					}

					if (!theresDuplicate) {
						// Insert the song object into db
						playlistDB.insert(songToAdd, function (err) {
							if (err) {
								console.log(err);
							}
						})
					}
					res.end(JSON.stringify({ song: songToAdd, duplicate: theresDuplicate }))
				}
			})
		} else if (finish.action == "GET_PLAYLIST") {
			res.writeHead(200, { "content-type": "application/json", "Access-Control-Allow-Origin": "*" })

			// Get all db elements (list of objects)
			playlistDB.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					res.end(JSON.stringify(docs))
				}
			})
		}
	})
}

server.listen(PORT, function () {
	console.log("Server running on port " + PORT)
})