var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    keyJoin = require('../../lib/common').keyJoin,
    connectSocket = require('../common').connectSocket,
    mockOptions = require('../common').mockOptions,
    GameRoom = require('../..');

describe('Server `leave` handler', function() {

    it('should remove user from room', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server, mockOptions()),
            roomName = uid();

        var client1 = connectSocket(server, { multiplex: false }),
            client2 = connectSocket(server, { multiplex: false });

        client1.emit('create', roomName, function() {
            client2.emit('join', roomName, function() {
                client2.emit('leave', roomName, function() {
                    gameroom.cmd.smembers(keyJoin('rooms', roomName, 'sockets'), function(err, sockets) {
                        sockets.length.should.equal(1);
                        done();
                    });
                });    // client 2 leave
            });    // client 2 join
        });    // client 1 create

    });

});