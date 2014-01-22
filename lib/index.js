var util = require('util'),
    io = require('socket.io');

var GameRoom = module.exports = function(http, opt) {
    io.call(this, http, opt);
     
    this.sockets.on('connection', function (socket) {
        socket.emit('identity', socket.id);        
    });
    
};

util.inherits(GameRoom, io);
