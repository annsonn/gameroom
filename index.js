var util = require('util'),
    io = require('socket.io');

var GameRoom = module.exports = function(http, opt) {
    io.call(this, http, opt);
};

util.inherits(GameRoom, io);

