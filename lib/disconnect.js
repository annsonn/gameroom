var keyJoin = require('./common').keyJoin;

module.exports = function(message) {
    var self = this,
        socketKey = keyJoin('sockets', this.id, 'rooms'),
        startIndex = 8,    // sockets(7) + :(1) = 8 
        socket = this;
    
    this.gameroom.cmd.smembers(socketKey, function(err, rooms) {
        self.gameroom.pub.publish('gameroom', {rooms: rooms, data: {action: 'disconnect', player: this.login}});
    });
    
    this.gameroom.cmd.del(socketKey);
    this.adapter.delAll(this.id, fn);
};