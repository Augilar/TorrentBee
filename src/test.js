'use strict'

const fs = require('fs');
const Buffer = require('buffer').Buffer;
const bencode = require('bencode');
const bn = require('bn.js');
const urlParse = require('url').parse;

// var n = new bn(121);

// var k = n.toBuffer('be', 10);

let torrent = bencode.decode(fs.readFileSync('test-torrent3.torrent'));
//console.log(torrent['announce-list'].toString('utf8'));

for(let i=0;i<torrent['announce-list'].length;i++){
    console.log(torrent['announce-list'][i].toString());
}

// let buf = Buffer.alloc(5);
// console.log(buf);