var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    Client = require('socket.io-client'),
    request = require('supertest'),
    GameRoom = require('..');

var connectSocket = function(server) {
    var addr = server.address() || server.listen().address();

    return Client('ws://' + addr.address + ':' + addr.port);
};

// Store login
var connectAndIdentify = function(server) {
    var client = connectSocket(server);

    client.on('identity', function(id) {
        client.login = id;
    });
    return client;
};

describe('websocket server', function() {
    it('should attach to http server using constructor', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server);

        request(server)
            .get('/socket.io/socket.io.js')
            .expect(200, done);
    });

    it('should attach to http server method', function(done) {
        var server = new Server(),
            gameroom = new GameRoom();

        gameroom.attach(server);

        request(server)
            .get('/socket.io/socket.io.js')
            .expect(200, done);
    });

    it('should send client identity on connection', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server),
            client = connectSocket(server);

        client.on('identity', function(data) {
            data.should.be.an.instanceOf(String);
            done();
        });
    });

    it('should disconnect user and remove user from room', function(done) {
        var roomName = uid(),
            server = new Server(),
            gameroom = new GameRoom(server),
            client1 = connectSocket(server);
            client2 = connectSocket(server);

        client1.emit('create', roomName);

        client1.on('joined', function(data) {
            client2.emit('join', roomName);
        });

        client2.on('joined', function(data) {
            client2.disconnect();
        });

        client2.on('disconnect', function() {
            gameroom.of(roomName).sockets.length.should.equal(1);
            done();
        });
    });

});
