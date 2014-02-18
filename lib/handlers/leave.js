var keyJoin = require('../common').keyJoin;

module.exports = function(roomName, fn) {
    if (typeof roomName === 'function') {
        fn = roomName;
        roomName = false;
    }

    var self = this,
        socketKey = keyJoin('sockets', this.id, 'rooms');
    
    if (roomName) {
        var roomKey = keyJoin('rooms', roomName, 'sockets');
        
        self.gameroom.pub.publish('gameroom', {rooms: [roomName], data: {action: 'leave', player: this.login}});
        self.gameroom.cmd.srem(socketKey, roomName);
        self.gameroom.cmd.srem(roomKey, self.id);
        
        this.leave(roomName, fn);
    } else {
        // Leave all rooms
        this.gameroom.cmd.smembers(socketKey, function(err, rooms) {
            self.gameroom.pub.publish('gameroom', {rooms: rooms, data: {action: 'leave', player: this.login}});
            
            rooms.forEach(function(room) {
                var roomKey = keyJoin('rooms', room, 'socket');
                
                self.gameroom.cmd.srem(socketKey, room);
                self.gameroom.cmd.srem(roomKey, self.id);
            });
        });
        
        this.adapter.delAll(this.id, fn);
    }
};