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
  var that = {};
  var on = false;

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
      // eslint-disable-next-line no-console
      console.log(message);
    }
    return that;
  };

  that.time = function(tag) {
    if (on) {
      // eslint-disable-next-line no-console
      console.time(tag);
    }
    return that;
  };

  that.timeEnd = function(tag) {
    if (on) {
      // eslint-disable-next-line no-console
      console.timeEnd(tag);
    }
    return that;
  };

  return that;
})();
