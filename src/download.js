'use strict'

const net = require('net');
const tracker = require('./tracker');
const message = require("./message");
const Pieces = require("./Pieces");
const Queue = require("./Queue");
const fs = require("fs");

module.exports = (torrent, path) => {
    
    tracker.getPeers(torrent, (peers) => {
        const pieces = new Pieces(torrent);
        //because the pieces will have 20byte hash for each piece
        const file = fs.openSync(path, 'w');
        console.log("List of peers : ", peers);
        peers.forEach(peer => download(peer, torrent, pieces, file));
    });
};

function download(peer, torrent, pieces) {
    const socket = net.Socket();
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {
        console.log("tcp connection made");
        socket.write(message.buildHandshake(torrent));
    });
    const queue = new Queue(torrent);
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

function haveHandler(socket, pieces, queue, payload) {
    const pieceIndex = payload.readUInt32BE(0);
    // if(!requested[pieceIndex]){
    //     socket.write(message.buildRequest());
    // }
    // requested[pieceIndex] = true;
    const queueEmpty = queue.length === 0;
    queue.queue(pieceIndex);
    if (queueEmpty) requestPiece(socket, pieces, queue);
};

function bitfieldHandler(socket, pieces, queue, payload) {
    const queueEmpty = queue.length === 0;
    payload.forEach((byte, i) => {
        for(let j=0; j<8 ; j++){
            if(byte % 2) queue.queue(i * 8 + 7 - j);
            byte = Math.floor(byte/2);
        }
    });
    if(queueEmpty) requestPiece(socket, pieces, queue);
};

function pieceHandler(socket, pieces, queue, torrent, file, pieceResp) {
    console.log(pieceResp);
    pieces.addReceived(pieceResp);

    const offset = pieceResp.index * torrent.info['piece length'] + pieceResp.begin;
    fs.write(file, pieceResp.block, 0, pieceResp.block.length, offset, () => {});

    if(pieces.isDone()) {
        socket.end();
        console.log("Done!!!");
        try {
            fs.closeSync(file);
        } catch(e) {}
        
    } else {
        requestPiece(socket, pieces, queue);
    }
};

function requestPiece(socket, pieces, queue) {
    if (queue.choked) return null;

    while (queue.length()) {
        const pieceBlock = queue.deque();
        if (pieces.needed(pieceBlock)) {
            socket.write(message.buildRequest(pieceBlock));
            pieces.addRequest(pieceBlock);
            break;
        }
    }
};