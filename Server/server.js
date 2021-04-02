const PORT = 3000;
const path = require("path");
const http = require("http")
const fs = require("fs")
const qs = require("querystring");


// fs.readFile(imgPath, function (error, data) {
// 	res.writeHead(200, { "Content-Type": 'text/html; charset=utf-8' });
// 	res.write(data)
// 	res.end();
// })

const server = http.createServer(function (req, res) {
	// console.log(req.method);

	switch (req.method) {
		case "GET":
			// console.log(req.url);
			if (req.url == "/") {
				// console.log(req.url);
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
					console.log("GET .mp3");
					fs.readFile("./static" + path, function (error, data) {
						if (error) {
							return console.log(error)
						} else {
							res.writeHead(200, { "Content-Type": "audio/mpeg", "Access-Control-Allow-Origin": "*" })
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
		console.log("data: " + data)
		allData += data;
	})

	req.on("end", function () {
		var finish = JSON.parse(allData);
		// console.log(finish);

		if (finish.action == "FIRST") {
			res.writeHead(200, { "content-type": "application/json", "Access-Control-Allow-Origin": "*" })
			// servRes, first - nazwy katalogów i piosenki z pierwszego albumu
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
							if (files[fileIndex].substr(files[fileIndex].length - 4) == ".jpg") {
								// It's a cover
								// console.log("It's a cover!");
							} else {
								let statsSize = fs.statSync(__dirname + "/static/albums/" + servRes.albums[0] + "/" + files[fileIndex]).size;
								let fileInfo = {
									name: files[fileIndex],
									size: statsSize,
								}
								servRes.files.push(fileInfo)
							}
						}
					}
					// console.log(servRes);
					res.end(JSON.stringify(servRes, null, 4));
				})
			})
		} else if (finish.action == "NEXT") {
			// Send back a list of songs from an album
			res.writeHead(200, { "content-type": "application/json", "Access-Control-Allow-Origin": "*" })
			// servRes, next - piosenki z danego albumu
			var servRes = {
				info: "next",
				files: [],
			}

			fs.readdir(__dirname + "/static/albums/" + finish.albumName, function (err, files) {
				if (err) {
					return console.log(err)
				} else {
					for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
						if (files[fileIndex].substr(files[fileIndex].length - 4) == ".jpg") {
							// It's a cover
							// console.log("It's a cover!");
						} else {
							let statsSize = fs.statSync(__dirname + "/static/albums/" + finish.albumName + "/" + files[fileIndex]).size;
							let fileInfo = {
								name: files[fileIndex],
								size: statsSize,
							}
							servRes.files.push(fileInfo)
						}
					}
				}
				// console.log(servRes);
				res.end(JSON.stringify(servRes, null, 4));
			});

		} else {
			console.log("inny adres");
		}
	})


}

server.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT)
})