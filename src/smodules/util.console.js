/**
 * smodules.util.console
 *
 * on()
 * off()
 * log(message)
 * time(tag)
 * timeEnd(tag)
 */
smodules.util.console = (function() {
    var that = {},
        on   = false;

    that.on = function() {
        on = true;
        return that;
    };

    that.off = function() {
        on = false;
        return that;
    };

    that.log = function(message) {
        if (on) {
            console.log(message);
        }
        return that;
    };

    that.time = function(tag) {
        if (on) {
            console.time(tag);
        }
        return that;
    };

    that.timeEnd = function(tag) {
        if (on) {
            console.timeEnd(tag);
        }
        return that;
    };

    return that;
})();
