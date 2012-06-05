/**
 * smodules.storage
 *
 * get(key, defaultValue)
 * getJSON(key, defaultObject)
 * set(key, value)
 * setJSON(key, value)
 */
smodules.storage = (function() {
    var that = {};

    that.get = function(key, defaultValue) {
        var value = localStorage.getItem(key);

        if (typeof defaultValue === "undefined") {
            return value;
        } else {
            return value === null ? defaultValue : value;
        }
    };

    that.getJSON = function(key, defaultObject) {
        var value = localStorage.getItem(key);

        if (typeof defaultObject === "undefined") {
            return value === null ? {} : JSON.parse(value);
        } else {
            return value === null ? defaultObject : JSON.parse(value);
        }
    };

    that.set = function(key, value) {
        localStorage.setItem(key, value);
    };

    that.setJSON = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    return that;
})();
