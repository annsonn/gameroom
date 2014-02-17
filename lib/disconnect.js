module.exports = function(message) {
    console.log('disconnect!');
    // TODO emit leave to all
    this.adapter.delAll(this.id, fn);
};