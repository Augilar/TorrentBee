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
    socket.on('data', data => {

    });
}