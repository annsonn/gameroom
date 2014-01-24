var should = require('should'),
	uid = require('uid'),
	leave = require('../lib/leave');

describe('Server `leave` handler', function() {

	it('should remove user from room', function(done) {
		var broadcastedToRoom = false,
			mockedSocket = {
				login: uid(),
				room: uid(),
				server: {
					in: function(roomName) {
						roomName.should.equal(mockedSocket.room);

						return {
							emit: function(key, value) {
								key.should.equal('left');
								value.should.have.property('player').and.equal(mockedSocket.login);
								value.should.have.property('game').and.equal(mockedSocket.room);
								value.should.have.property('action').and.equal('leave');

								broadcastedToRoom = true;
							}
						};
					}

				},
				leaveAll: function() {
					broadcastedToRoom.should.equal(true);
					done();
				}
		};

		leave.call(mockedSocket);
	});

	it('should error when user is not in a room', function(done) {
		var mockedSocket = {
			emit: function(key, value) {
				key.should.equal('left');
				value.should.equal('error');
			}
		};
	});

});