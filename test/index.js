var Server = require('http').Server,
    should = require('should'),
    uid = require('uid'),
    Client = require('socket.io-client'),
    request = require('supertest'),
    connectSocket = require('./common').connectSocket,
    GameRoom = require('..');

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

    it.skip('should disconnect user and remove user from room', function(done) {
        var roomName = uid(),
            server = new Server(),
            gameroom = new GameRoom(server);
        
        var client1 = connectSocket(server, { multiplex: false }),
            client2 = connectSocket(server, { multiplex: false });
        
        client1.emit('create', roomName, function() {
            client2.emit('join', roomName, function() {
                gameroom.in(roomName).sockets.length.should.equal(2);

                client2.disconnect();
            });
        });
        
        client2.on('disconnect', done);    // Cannot validate
        
    });

});
