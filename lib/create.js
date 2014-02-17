var games = require('./games');

module.exports = function(roomName, fn) {
    var self = this;
    
    if (games[roomName] && fn) {
        return fn({error: 'room already created'});
    }

    games[roomName] = [self.login];
    this.join(roomName, fn);
};
