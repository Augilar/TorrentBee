'use strict'

const net = require('net');
const tracker = require('./tracker');

module.exports = (torrent) => {
    tracker.getPeers(torrent, (peers) => {
        console.log("List of peers : ", peers);
        peers.forEach(download);
    });
}

function download(peer) {
    const socket = net.Socket();
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {
        console.log("tcp connection made");
    });
    onWholeMsg(socket, data => {

    });
}

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
}