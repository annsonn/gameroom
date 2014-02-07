var games = require('./games');

module.exports = function(roomName) {
    var self = this;
    if (games[roomName]) {
        return self.emit('joined', {error: 'room already created'});
    }

    games[roomName] = [self.login];
    self.join(roomName, function() {
        self.in(roomName).emit('joined', {player: self.login, game: roomName});
    });
};
