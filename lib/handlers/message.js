module.exports = function(message, fn) {
    var data = {message: message.message, player: this.login};
    if (message.room) {
        data.room = message.room;
        this.gameroom.pub.publish('gameroom', {rooms: [message.room], data: data});
    } else if (message.player) {
        this.gameroom.pub.publish('gameroom', {player: message.player, data: data});
    } else {
        this.gameroom.pub.publish('gameroom', {data: data});
    }
    if (fn) {
        fn(null, data);
    }
};