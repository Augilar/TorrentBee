'use strict'

const fs = require('fs');
const Buffer = require('buffer').Buffer;
const bencode = require('bencode');
const bn = require('bn.js');
const urlParse = require('url').parse;

// var n = new bn(121);

// var k = n.toBuffer('be', 10);

let torrent = bencode.decode(fs.readFileSync('test-multi.torrent'));
console.log(urlParse(torrent.announce.toString('utf8')));

// let buf = Buffer.alloc(5);
// console.log(buf);