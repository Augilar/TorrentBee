'use strict'

const net = require('net');
const tracker = require('./tracker');
const message = require("./message")
const Pieces = require("./Pieces.js");

module.exports = (torrent) => {
    
    tracker.getPeers(torrent, (peers) => {
        const pieces = new Pieces(torrent.info.pieces.length/20);
        console.log("List of peers : ", peers);
        peers.forEach(peer => download(peer, torrent, pieces));
    });
};

function download(peer, torrent, pieces) {
    const socket = net.Socket();
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {
        console.log("tcp connection made");
        socket.write(message.buildHandshake(torrent));
    });
    const queue = {choked: true, queue: []};
    onWholeMsg(socket, msg => {
        msgHandler(msg, socket, pieces, queue);
    });
};

function onWholeMsg(socket, callback) {
    let savedBuf = Buffer.alloc(0);
    let handshake = true;

    socket.on('data', recvBuf => {
        //len of the whole msg
        const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readUInt32BE(0) + 4;
        savedBuf = Buffer.concat([savedBuf, recvBuf]);

        while(savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
            callback(savedBuf.slice(0, msgLen()));  //because part of next message may also be there
            savedBuf = savedBuf.slice(msgLen()); //new message part
            handshake = false;
        }
    });
};

function msgHandler(msg, socket, pieces, queue) {
    if(isHandshake(msg)) {
        socket.write(message.buildInterested());
    } else {
        const m = message.parse(msg);

        if (m.id === 0) chokeHandler(socket);
        if (m.id === 1) unchokeHandler(socket, pieces, queue);
        if (m.id === 4) haveHandler(m.payload);
        if (m.id === 5) bitfieldHandler(m.payload);
        if (m.id === 7) pieceHandler(m.payload);
    }
};

function isHandshake(msg) {
    return msg.length === msg.readUInt8(0) + 49 && msg.toString('utf8', 1) === 'BitTorrent protocol';
};

function chokeHandler(socket) {
    socket.end();
};

function unchokeHandler(socket, pieces, queue) {
    queue.choked = false;
    requestPiece(socket, pieces, queue);
};

function haveHandler(payload, socket, requested) {
    const pieceIndex = payload.readUInt32BE(0);
    // if(!requested[pieceIndex]){
    //     socket.write(message.buildRequest());
    // }
    // requested[pieceIndex] = true;
    queue.push(pieceIndex);
    if(queue.length === 1){
        requestPiece(socket, requested, queue);
    }
};

function bitfieldHandler(payload) {

};

function pieceHandler(payload, socket, requested, queue) {
    queue.shift();
    requestPiece(socket, requested, queue);
};

function requestPiece(socket, pieces, queue) {
    if (queue.choked) return null;

    while (queue.queue.length) {
        const pieceIndex = queue.shift();
        if (pieces.needed(pieceIndex)) {
            socket.write(message.buildRequest(pieceIndex));
            pieces.addRequest(pieceIndex);
            break;
        }
    }
};