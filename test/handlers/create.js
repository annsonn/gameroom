var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    connectSocket = require('../common').connectSocket,
    mockOptions = require('../common').mockOptions,
    GameRoom = require('../..');

describe('Server `create` Handler', function() {

    it('should create room and callback', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server, mockOptions),
            roomName = uid();

        var client = connectSocket(server);
        
        client.emit('create', roomName, function() {
            gameroom.sockets.sockets[0].rooms.indexOf(roomName).should.equal(1);
            done();
        });
    });
    
    it('should error when creating an existing game', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server, mockOptions),
            roomName = uid();

        var client = connectSocket(server);
        
        client.emit('create', roomName, function() {
            
            // Create again!
            client.emit('create', roomName, function(err) {
                err.should.have.property('error').and.equal('room already created');
                done();
            });
        });
    });

});
