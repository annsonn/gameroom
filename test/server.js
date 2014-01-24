var Server = require('http').Server,
    should = require('should'),
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
}

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
        gameroom.attach(server);

        var client = connectSocket(server);
        client.on('identity', function(data) {
            data.should.be.an.instanceOf(String);
            done();
        });
    });

    it('should login a user', function(done) {
        var server = new Server();
        var gameroom = new GameRoom();
        var newIdentityName = 'new id name'
        gameroom.attach(server);

        var client = connectSocket(server);

        // Queue up the login command
        client.emit('login', {identity: newIdentityName});

        client.on('identity', function(data) {
            if (data === newIdentityName) {
                done();
            }
        });
    });

    it('should create a gameroom', function(done){
        var server = new Server();
        var gameroom = new GameRoom();
        var roomName = 'new Room Name';
        gameroom.attach(server);

        var client = connectAndIdentify(server);

        client.emit('create', roomName);

        client.on('joined', function(data) {
            data.player.should.equal(client.login);
            data.game.should.equal(roomName);
            client.emit('leave');
            done();
        });
                
    });

    it('should error when creating a gameroom that already exists', function(done) {
        var server = new Server();
        var gameroom = new GameRoom();
        var roomName = 'new Room Name';
        gameroom.attach(server);

        var client1 = connectAndIdentify(server);
        var client2 = connectAndIdentify(server);
        
        client1.emit('create', roomName);

        client1.on('joined', function(data) {
            data.player.should.equal(client1.login);
            data.game.should.equal(roomName);            
            client2.emit('create', roomName);  
        });        
        
        client2.on('joined', function(data) {
            if (data.error) {                
                done();
            }
        });
    });
    
    it('should add user into an existing room', function(done) {
        var server = new Server();
        var gameroom = new GameRoom();
        var roomName = 'new Room Name';
        var bothJoin, playerListSent;
        gameroom.attach(server);

        var client1 = connectAndIdentify(server);
        client1.emit('create', roomName);

        var client2 = connectAndIdentify(server);

        var doneWhenBothConditionsAreMet = function() {
            if (bothJoined && playerListSent) {
                done();
                client1.emit('leave');
                client2.emit('leave');
            }
        };

        client1.on('joined', function(data) {
            if (data.player === client1.login) {
                // Game created. client2 can join now.
                client2.emit('join', roomName);
            } else {
                data.player.should.equal(client2.login);
                data.game.should.equal(roomName);
                bothJoined = true;
                doneWhenBothConditionsAreMet();
            }
        });

        client2.on('joined', function(data) {
            data.player.should.equal(client2.login);
            data.game.should.equal(roomName);
            done();
        });

        client2.on('players', function(data) {
            data.length.should.equal(2);
            data[0].player.should.equal(client1.login);
            data[1].player.should.equal(client2.login);
            data[0].game.should.equal(roomName);
            data[1].game.should.equal(roomName);
            playerListSent = true;
            doneWhenBothConditionsAreMet();
        });
        
    });
    
    

    

    it('should error when joining a game that does not exist');
    it('should remove user from an existing room with many users');
    it('should remove user from an existing room with no users, and delete it');
    it('should disconnect user');
    it('should disconnect user and remove user from room');
    it('should pass message to another user');
    it('should pass message to room');

});
