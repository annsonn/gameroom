module.exports = function(data) {
    this.login = data.identity;
    this.emit('identity', this.login);
};
