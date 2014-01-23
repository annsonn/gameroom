var util = require('util'),
    io = require('socket.io');

var GameRoom = module.exports = function(http, opt) {
    io.call(this, http, opt);
     
    this.sockets.on('connection', function (socket) {
        socket.login = socket.id;
        socket.emit('identity', socket.login);               
        
        socket.on('login', function(data) {
            socket.login = data.identity;
            socket.emit('identity', socket.login);            
        });
        
        socket.on('create', function(data) {
            console.log('create the room');
        });
    });
     
};

util.inherits(GameRoom, io);
