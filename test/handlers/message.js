var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    connectSocket = require('../common').connectSocket,
    connectSocketAndIdentify = require('../common').connectSocketAndIdentify,
    mockOptions = require('../common').mockOptions,
    GameRoom = require('../..');

describe('Server `message` handler', function() {

    it('should pass message to logged in player', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server, mockOptions());

        var client1 = connectSocketAndIdentify(server, { multiplex: false }),
            client2 = connectSocket(server, { multiplex: false });

        client2.on('identity', function(login) {
            client2.login = login;

            // Get client1 to send to client2
            client1.emit('message', {player: login, message: 'test'}, function(err, data) {
                data.should.have.property('player').and.equal(client1.login);
                data.should.have.property('message').and.equal('test');
            });
        });

        client2.on('message', function(data) {
            data.should.have.property('player').and.equal(client1.login);
            data.should.have.property('message').and.equal('test');
            done();
        });
    });

    it('should pass message to room', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server, mockOptions()),
            roomName = uid();

        var client1 = connectSocketAndIdentify(server, { multiplex: false }),
            client2 = connectSocketAndIdentify(server, { multiplex: false });

        client1.emit('create', roomName, function() {
            client2.emit('message', {room: roomName, message: 'test'});
        });

        client1.on('message', function(data) {
            data.should.have.property('room').and.equal(roomName);
            data.should.have.property('player').and.equal(client2.login);
            data.should.have.property('message').and.equal('test');
            done();
        });
    });

    it('should pass message to player in different server', function(done) {
        var server1 = new Server(),
            server2 = new Server(),
            gameroom1 = new GameRoom(server1, mockOptions()),
            gameroom2 = new GameRoom(server2, mockOptions()),
            roomName = uid();

        var client1 = connectSocketAndIdentify(server1, { multiplex: false }),
            client2 = connectSocket(server2, { multiplex: false });

        client2.on('identity', function(login) {
            client2.login = login;

            // Get client1 to send to client2
            client1.emit('message', {player: login, message: 'test'}, function(err, data) {
                data.should.have.property('player').and.equal(client1.login);
                data.should.have.property('message').and.equal('test');
            });
        });

        client2.on('message', function(data) {
            data.should.have.property('player').and.equal(client1.login);
            data.should.have.property('message').and.equal('test');
            done();
        });
    });


});