const hash = function() {
  var that = {}, store = {};

  var has = function(key) {
    return store.hasOwnProperty(key);
  };

  that.add = function(key, value) {
    store[key] = value;
    return that;
  };

  that.remove = function(key) {
    if (has(key)) {
      delete store[key];
    }
    return that;
  };

  that.clear = function() {
    store = {};
    return that;
  };

  that.has = function(key) {
    return has(key);
  };

  that.get = function(key) {
    return store[key];
  };

  that.getKeys = function() {
    var key, keys = [];

    for (key in store) {
      if (has(key)) {
        keys.push(key);
      }
    }
    keys.sort();

    return keys;
  };

  return that;
};

module.exports.init = function () {
  return hash();
};
