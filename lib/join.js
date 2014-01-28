var games = require('./games');

module.exports = function(roomName) {
    if (!games[roomName]) {
        return this.emit('joined', {error: 'room does not exist'});
    }

    if (this.rooms && this.rooms.length > 0) {
        this.onLeave();
    }

    games[roomName].push(this.login);
    this.join(roomName);
    this.server.in(roomName).emit('joined', {player: this.login, game: roomName});

    var playerList = games[roomName].map(function(playerLogin) {
        return {player: playerLogin, game: roomName};
    });
    this.emit('players', playerList);
};