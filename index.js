'use strict';

const fs = require("fs");
const bencode = require("bencode");
const tracker = require("./tracker");

const torrent = bencode.decode(fs.readFileSync('puppy.torrent'));//readFileSync - easiest way to read a file, but instead of returning a string it returns a buffer, so we have to convert into a string
//console.log(torrent.announce.toString('utf8'));

tracker.getPeers(torrent, (peers) => {
    console.log('The list of peers the tracker file returned are : \n ', peers);
})