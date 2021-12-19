'use strict'

const fs = require('fs');
const bencode = require('bencode');
const crypto = require('crypto');
const bn = require('bn.js');

module.exports.open = (filepath) => {
    return bencode.decode(fs.readFileSync(filepath));//readFileSync - easiest way to read a file, but instead of returning a string it returns a buffer, so we have to convert into a string
    //console.log(torrent.announce.toString('utf8'));
}

module.exports.infoHash = (torrent) => {
    return crypto.createHash('SHA1').update(bencode.encode(torrent.info)).digest(); // digest without any arg will return a buffer
};

module.exports.size = (torrent) => {
    let len = torrent.info.files ? torrent.info.files.map(file => file.length).reduce((a, b) => (a+b)) : torrent.info.length ;
    let bigNum = new bn(len);
    return bigNum.toBuffer('be', 8);
};