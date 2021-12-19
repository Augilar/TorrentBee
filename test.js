'use strict'

const Buffer = require('buffer').Buffer;
const bn = require('bn.js');

var n = new bn(121);

var k = n.toBuffer('be', 10);

console.log(n);