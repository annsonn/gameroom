var should = require('should'),
    uid = require('uid'),
    games = require('../lib/games'),
    create = require('../lib/create');

describe('Server `create` Handler', function() {

    it('should create a new game', function(done) {
        var roomName = uid(),
            joinedRoom = false,
            mockedSocket = {
                login: uid(7),
                join: function(key, value) {
                    key.should.equal(roomName);

                    joinedRoom = true;
                },
                server: {
                    in: function(name) {
                        name.should.equal(roomName);
                        return {
                            emit: function(key, value) {
                                key.should.equal('joined');
                                value.should.have.property('game').and.equal(roomName);
                                value.should.have.property('player').and.equal(mockedSocket.login);

                                joinedRoom.should.equal(true);                                
                                done();
                            }
                        };
                    }
                }
            };

            create.call(mockedSocket, roomName);
    });

    it('should error when creating an existing game', function(done) {
        var roomName = uid();

        games[roomName] = 'exists';

        var mockedSocket = {
            emit: function(key, value) {
                key.should.equal('joined');
                value.should.equal('error');
                done();
            }
        };

        create.call(mockedSocket, roomName);
    });

});