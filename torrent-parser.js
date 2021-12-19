'use strict'

const fs = require('fs');
const bencode = require('bencode');

module.exports.open = (filepath) => {
    return bencode.decode(fs.readFileSync(filepath));//readFileSync - easiest way to read a file, but instead of returning a string it returns a buffer, so we have to convert into a string
    //console.log(torrent.announce.toString('utf8'));
}

module.exports.infoHash = (torrent) => {

};

module.exports.left = (torrent) => {

};