var games = require('./games');

module.exports = function(roomName) {
    if (games[roomName]) {
        return this.emit('joined', {error: 'room already created'});
    }

    games[roomName] = [this.login];
    this.join(roomName, function() {
        console.log(this.login);
        this.in(roomName).emit('joined', {player: this.login, game: roomName});
    });
};
