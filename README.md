# TorrentBee

---

Contents of this file :
-------------------------

* Introduction
* Technologies used
* Working
* Current functionality
* Future enhancements

INTRODUCTION
-------------

This is a personal torrent client application which is currently a command line application which is made using nodejs. What's special about this torrent client is that it uses UDP for communication with tracker server instead of TCP which makes it faster.

TECHNOLOGIES USED
------------------

* dgram.js
* bencode.js
* buffer.js

WORKING
--------

Before going into detail let's first understand how a torrent client works in a simple way.

* Normally, if you want to share or download a file to/from another computer (node) then you make a connection with that computer and then send/recieve data packets.
* In Torrenting this happens in a different way. There is a tracker server which contains data regarding the IP addresses of the nodes which contains (partially contains) some specific files. And then a torrent file is circulated which is of very small size containg meta data of the file to be downloaded, tracker url and hashes of the file. Then when someone wants to download the file they will use the torrent file and send a request to the tracker URL which will reply with list of peers and then it will make connections with the set of peers and will request pieces of the files that it doesn't have.

Torrenting may seem complicated for simply downloading a file but it has its elegance

* In normal downloading (client server) if the connection is lost then connection is made again.
* But in torrenting if a connection with a peer is lost then there are many others through which downloading is possible.

* If only one has the original file then sharing of the file happens in such a way that each one has to wait for the others to complete.
* But in the case of torrent, even if the peer with the total file has lost the connection, others peers with only partia but different packets of data can send each other and doanloading can be completed.

RESOURSES
----------

* Allen Kim's Blog
* Kristewindman's Blog (recurse centre)
* Unofficial documentation of bittorent

CURRENT FUNCTIONALITY
----------------------

* single file torrents
* Only downloading no uploading functionality
* command line application no frontend
* Various optimal algorithms for downloading the data packets can be implemented on top of the existing algorithm.

FUTURE ENHANCEMENTS
--------------------

* Creating a frontend.
* Makingg it functional for multiple file downloads.
* Making uploads functional.
* Apply different algorithm for peer connections.
* A function to get the progress of download.
* Create a TCP version i.e. which sends a TCP requests instead of UDP (depends on the tracker URL). 
