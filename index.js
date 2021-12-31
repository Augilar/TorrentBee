'use strict';

// const fs = require("fs");
// const bencode = require("bencode");
const download = require("./src/download.js");
const tracker = require("./src/tracker.js");
const torrentParser = require('./src/torrent-parser');

const torrent = torrentParser.open('test-torrent3.torrent');

//console.log(torrent);

download(torrent, torrent.info.name);
