var Server = require('http').Server,
    Client = require('socket.io-client'),
    request = require('supertest'),
    GameRoom = require('..');

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
            var client = new Client(server);
            client.on('identity', function(data) {
                data.should.be.an.instanceOf(String);
                done();
            });
        });

    });
});
