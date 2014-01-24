var should = require('should'),
    uid = require('uid'),
    games = require('../lib/games'),
    join = require('../lib/join');

describe('Server `join` handler', function() {

    it('should add user to existing game', function(done) {
        var roomName = uid(),
            joinedRoom = false,
            broadcastedJoin = false,
            mockedSocket = {
                login: uid(),
                server: {
                    join: function(name) {
                        name.should.equal(roomName);

                        joinedRoom = true;
                    },
                    in: function(name) {
                        name.should.equal(roomName);

                        return {
                            emit: function(key, value) {
                                key.should.equal('joined');
                                value.should.have.property('game').and.equal(roomName);
                                value.should.have.property('player').and.equal(mockedSocket.login);

                                broadcastedJoin = true;
                            }
                        };
                    }
                },
                emit: function(key, value) {
                    key.should.equal('players');
                    value.should.be.an.instanceOf(Array);
                    value.should.have.property('length').and.equal(1);
                    value[0].game.should.equal(roomName);
                    value[0].player.should.equal(mockedSocket.login);

                    joinedRoom.should.equal(true);
                    broadcastedJoin.should.equal(true);

                    done();
                }
            };

        games[roomName] = [];

        join.call(mockedSocket, roomName);
    });

    it('should error when joining a non existing game', function(done) {
        var roomName = uid(),
            mockedSocket = {
                emit: function(key, value) {
                    key.should.equal('joined');
                    value.should.equal('error');

                    done();
                }
            };

        join.call(mockedSocket, roomName);
    });
    
});
