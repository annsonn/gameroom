module.exports = function(channel, message) {
    var self = this;
    if (message.rooms) {
        message.rooms.forEach(function(room) {
            message.data.game = room;
            self.in(room).emit(message.data);
        });
    } else if(message.player) {
        // TODO find player and send message only to them
    }
};