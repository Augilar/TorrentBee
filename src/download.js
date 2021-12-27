'use strict'

const net = require('net');
const tracker = require('./tracker');
const message = require("./message")

module.exports = (torrent) => {
    tracker.getPeers(torrent, (peers) => {
        console.log("List of peers : ", peers);
        peers.forEach(peer => download(peer, torrent));
    });
};

function download(peer, torrent) {
    const socket = net.Socket();
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {
        console.log("tcp connection made");
        socket.write(message.buildHandshake(torrent));
    });
    onWholeMsg(socket, msg => {
        msgHandler(msg, socket);
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

function msgHandler(msg, socket) {
    if(isHandshake(msg)) {
        socket.write(message.buildInterested());
    } else {
        const m = message.parse(msg);

        if (m.id === 0) chokeHandler();
        if (m.id === 1) unchokeHandler();
        if (m.id === 4) haveHandler(m.payload);
        if (m.id === 5) bitfieldHandler(m.payload);
        if (m.id === 7) pieceHandler(m.payload);
    }
};

function isHandshake(msg) {
    return msg.length === msg.readUInt8(0) + 49 && msg.toString('utf8', 1) === 'BitTorrent protocol';
};

function chokeHandler() {

};

function unchokeHandler() {

};

function haveHandler(payload) {

};

function bitfieldHandler(payload) {

};

function pieceHandler(payload) {

};