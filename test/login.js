var should = require('should'),
    login = require('../lib/login');

describe('Server `login` handler', function() {

    it('should change socket login', function(done) {
        var newIdentity = 'new id', 
            mockedSocket = {
                emit: function(key, value) {
                    this.should.have.property('login').and.equal(newIdentity);
                    key.should.equal('identity');
                    value.should.equal(newIdentity);
                    done();
                }
            };

        login.call(mockedSocket, {identity: newIdentity});

    });

});