var keyJoin = require('../common').keyJoin;

module.exports = function(message) {
    var self = this,
        socketKey = keyJoin('sockets', this.id, 'rooms'),
        userKey = keyJoin('users', this.login);
    
    this.gameroom.cmd.smembers(socketKey, function(err, rooms) {
        self.gameroom.pub.publish('gameroom', {rooms: rooms, data: {action: 'disconnect', player: this.login}});
        
        rooms.forEach(function(room) {
            var roomKey = keyJoin('rooms', room, 'sockets');
            
            self.gameroom.cmd.srem(roomKey, self.id);
        });
    });
    
    this.gameroom.cmd.del(socketKey);
    this.gameroom.cmd.del(userKey);
    this.adapter.delAll(this.id);
};