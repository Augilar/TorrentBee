'use strict';

const fs = require("fs");
const torrent = fs.readFileSync('shikamaru_BMP.torrent');//readFileSync - easiest way to read a file, but instead of returning a string it returns a buffer, so we have to convert into a string
console.log(torrent.toString('utf8'));
