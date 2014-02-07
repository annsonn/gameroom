var games = require('./games');

module.exports = function(roomName) {
    var self = this;
    if (!games[roomName]) {
        return self.emit('joined', {error: 'room does not exist'});
    }

    if (self.rooms && self.rooms.length > 0) {
        self.onLeave();
    }

    games[roomName].push(self.login);
    self.join(roomName, function() {
        self.in(roomName).emit('joined', {player: self.login, game: roomName});
    });

    var playerList = games[roomName].map(function(playerLogin) {
        return {player: playerLogin, game: roomName};
    });
    self.emit('players', playerList);
};