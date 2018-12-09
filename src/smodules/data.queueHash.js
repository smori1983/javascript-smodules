smodules.data.queueHash = function() {
  var that = smodules.data.hash();
  var parent = {
    add: smodules.mod.superior(that, 'add'),
    get: smodules.mod.superior(that, 'get'),
  };

  delete that.add;
  delete that.get;

  that.addTo = function(key, value) {
    var queue = that.has(key) ? parent.get(key) : [];

    queue.push(value);
    parent.add(key, queue);
    return that;
  };

  that.getFrom = function(key) {
    if (that.has(key)) {
      return parent.get(key).shift();
    }
  };

  that.sizeOf = function(key) {
    if (that.has(key)) {
      return parent.get(key).length;
    } else {
      return 0;
    }
  };

  return that;
};
