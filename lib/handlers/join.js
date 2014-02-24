var keyJoin = require('../common').keyJoin;

module.exports = function(roomName, fn) {
    var self = this,
        roomKey = keyJoin('rooms', roomName, 'sockets'),
        socketKey = keyJoin('sockets', this.id, 'rooms');

    this.gameroom.cmd.exists(roomKey, function(err, exists) {
        if (!exists && fn) {
            return fn({error: 'room does not exist'});
        } else {
            self.gameroom.cmd.sadd(roomKey, self.id);
            self.gameroom.cmd.sadd(socketKey, roomName);

            self.join(roomName, function() {
                self.gameroom.pub.publish('gameroom', {rooms: [roomName], channel: 'joined', data: {player: this.login}});

                self.in(roomName).emit('joined', {player: self.login, game: roomName});

                self.gameroom.cmd.smembers(roomKey, fn);
            });
        }
    });

};