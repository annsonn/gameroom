var keyJoin = require('./common').keyJoin;

module.exports = function(roomName, fn) {
    var self = this,
        roomKey = keyJoin('rooms', roomName, 'sockets'),
        socketKey = keyJoin('sockets', this.id, 'rooms');
    
    this.gameroom.cmd.exists(roomKey, function(err, exists) {
        if (exists && fn) {
            return fn({error: 'room already created'});
        } else {
            self.gameroom.cmd.sadd(roomKey, self.id);
            self.gameroom.cmd.sadd(socketKey, roomName);
        
            self.join(roomName, fn);
        }
    });
};
