const hash = require('./data.hash');
const superior = require('./mod.superior');

const queueHash = function() {
  const that = hash.init();
  const parent = {
    add: superior.init(that, 'add'),
    get: superior.init(that, 'get'),
  };

  delete that.add;
  delete that.get;

  that.addTo = function(key, value) {
    const queue = that.has(key) ? parent.get(key) : [];

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

module.exports.init = function () {
  return queueHash();
};
