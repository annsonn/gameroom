module.exports = function(roomName, fn) {
    if (typeof roomName === 'function') {
        fn = roomName;
        roomName = false;
    }
    
    if (roomName) {
        this.in(roomName).emit('left', {player: this.login, game: roomName, action: 'leave'});
        this.leave(roomName, fn);
    } else {
        // TODO emit leave to all
        this.adapter.delAll(this.id, fn);
    }
};