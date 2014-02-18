var Server = require('http').Server,
    should = require('should'),
    connectSocket = require('../common').connectSocket,
    mockOptions = require('../common').mockOptions,
    GameRoom = require('../..');


describe('Server `login` handler', function() {

    it('should change socket login', function(done) {
        var server = new Server(),
            gameroom = new GameRoom(server, mockOptions);
        
        var client = connectSocket(server);
        
        client.on('identity', function(id) {
            id.should.not.be.empty;
            done();
        });
    });

});