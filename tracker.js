'use strict';

const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const urlParse = require('url').parse;

module.exports.getPeers = (torrent, callback) => {

    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf8');

    // for the connection request
    udpSend();

    socket.on('message', response => {
        if(respType(response) == 'connect'){
            //get the connection id
            const connResp = parseConnResp(response);

            //send an announce request
            const announceReq = buildAnnounceReq(); 
            udpSend();
        }else if(respType(response) == 'announce'){

            //take the peer list from announce response
            const announceResp = announceRespParser(response);

            //send the peerlist back using the call back function
            callback(announceResp.peers)

        }
    })

}

function udpSend(){

}

function respType(){

}

function parseConn(){

}

function buildAnnounceReq(){

}

function announceRespParser(){
    
}