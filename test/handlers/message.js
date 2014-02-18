var uid = require('uid');
    //message = require('../../lib/message');

describe('Server `message` handler', function() {

    it.skip('should pass message to logged in player');

    it.skip('should error when target player does not exist', function(done) {
        var playerName = uid(),
            mockedSocket = {
                emit: function(key, value) {
                    key.should.equal('message');
                    value.should.have.property('error').and.equal('player does not exist');

                    done();
                }
            };
        message.call(mockedSocket, {player: playerName});
    });

    it('should pass message to room');
    it.skip('should error when room does not exist', function(done) {
        var mockedSocket = {
            emit: function(key, value) {
                key.should.equal('message');
                value.should.have.property('error').and.equal('room does not exist');

                done();
            }
        };

        message.call(mockedSocket, '');
    });

});