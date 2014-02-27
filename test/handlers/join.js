var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    connectSocket = require('../common').connectSocket,
    mockOptions = require('../common').mockOptions,
    GameRoom = require('../..');

describe('Server `join` handler', function() {

    it('should add user to existing game', function(done) {
         var server = new Server(),
            gameroom = new GameRoom(server, mockOptions()),
            roomName = uid();

        var client1 = connectSocket(server, { multiplex: false }),
            client2 = connectSocket(server, { multiplex: false });

        client1.emit('create', roomName, function() {
            gameroom.sockets.sockets[0].rooms.indexOf(roomName).should.equal(1);

            client2.emit('join', roomName, function(err, playerList) {
                playerList.length.should.equal(2);
                done();
            });
        });
    });

    it('should error when joining a non existing game', function(done) {
         var server = new Server(),
            gameroom = new GameRoom(server, mockOptions()),
            roomName = uid();

        var client = connectSocket(server);

        client.emit('join', roomName, function(err) {
            err.should.have.property('error').and.equal('room does not exist');
            done();
        });
    });

});
