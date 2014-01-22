var Server = require('http').Server,
    Client = require('socket.io-client'),
    request = require('supertest'),
    GameRoom = require('..');

var connectSocket = function(server) {
    var addr = server.address() || server.listen().address();
    return Client('ws://' + addr.address + ':' + addr.port);
};

describe('websocket server', function() {
    it('should attach to http server using constructor', function(done) {
        var server = new Server();
        var gameroom = new GameRoom(server);

        request(server)
            .get('/socket.io/socket.io.js')
            .expect(200, done);
    });

    it('should attach to http server method', function(done) {
        var server = new Server();
        var gameroom = new GameRoom();
        gameroom.attach(server);

        request(server)
            .get('/socket.io/socket.io.js')
            .expect(200, done);
    });

    it('should send client identity on connection', function(done) {
        var server = new Server();
        var gameroom = new GameRoom();

        server.listen(function() {
            var client = connectSocket(server);
            client.on('identity', function(data) {
                data.should.be.an.instanceOf(String);
                done();
            });
        });
    });

    it('should login a user');
    it('should create a gameroom');
    it('should add user into an existing room');
    it('should remove user from an existing room with many users');
    it('should remove user from an existing room with no users, and delete it');
    it('should disconnect user');
    it('should disconnect user and remove user from room');
    it('should pass message to another user');
    it('should pass message to room');

});
