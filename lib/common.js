exports.keyJoin = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    
    return args.join(':');
};