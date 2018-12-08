/**
 * @param array    array
 * @param int      unit     Size to be accessed in one time.
 * @param int      interval Milliseconds to be waited for delay.
 * @param function callback Function to be called for each sliced array elements.
 * @param bool     loop     [optional]If true array will be accessed repeatedly.
 *
 * APIs:
 * start()
 * stop()
 */
smodules.util.delayedArrayAccess = function(spec) {
    if (!$.isArray(spec.array) ||
        typeof spec.unit !== 'number' ||
        typeof spec.interval !== 'number' ||
        typeof spec.callback !== 'function') {

        return;
    }

    spec.size = spec.array.length;

    var that = {},
        timeoutId = null;

    var execute = function(start) {
        var next = start + spec.unit;

        spec.callback(spec.array.slice(start, next));

        if (next < spec.size) {
            timeoutId = window.setTimeout(function() {
                execute(next);
            }, spec.interval);
        } else if (spec.loop) {
            timeoutId = window.setTimeout(function() {
                execute(0);
            }, spec.interval);
        } else {
            timeoutId = null;
        }
    };

    that.start = function() {
        execute(0);
        return that;
    };

    that.stop = function() {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
        }
        return that;
    };

    return that;
};
