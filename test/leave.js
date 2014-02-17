var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    connectSocket = require('./common').connectSocket,
    GameRoom = require('..');

describe('Server `leave` handler', function() {

    it.skip('should remove user from room', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server),
            roomName = uid();

        var client1 = connectSocket(server, { multiplex: false }),
            client2 = connectSocket(server, { multiplex: false });
        
        client1.emit('create', roomName, function() {

            client2.emit('join', roomName, function() {
                
                client2.emit('leave', roomName, done);    // Cannot validate
            });
        });
        
    });

});