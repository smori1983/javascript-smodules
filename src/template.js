const Evaluator = require('./evaluator');
const FilterManager = require('./filter-manager');
const Hash = require('./data.hash');
const QueueHash = require('./data.queueHash');
const parser = require('./parser');

const template = function() {
  const that = {};

  const _filterManager = new FilterManager();

  const _templates = new Hash();

  const _parser = parser.init();

  const _remoteQueue = new QueueHash();

  const _isRemoteFile = function (source) {
    return (/\.html$/).test(source);
  };

  const _preFetchJobList = (function () {
    let jobList = [];

    const check = function () {
      const finished = [];

      jobList.forEach(function (job) {
        job.sourceList = job.sourceList.filter(function (source) {
          return !_templates.has(source);
        });

        if (job.sourceList.length === 0) {
          finished.push(job);
        }
      });

      jobList = jobList.filter(function (job) {
        return job.sourceList.length > 0;
      });

      finished.forEach(function (job) {
        if (typeof job.callback === 'function') {
          job.callback();
        }
      });
    };

    return {
      add: function (sourceList, callback) {
        jobList.push({
          sourceList: sourceList,
          callback: callback,
        });
        check();
      },
      notifyFetched: function () {
        check();
      },
    };
  })();

  const _register = function (source, content) {
    _templates.add(source, _parser.parse(content, source));
  };

  const _registerFromRemote = (function () {
    const _fetching = new Hash();

    return function (source) {
      if (!_fetching.has(source)) {
        _fetching.add(source, true);

        $.ajax({
          url: source,
          success: function (response) {
            let queue;

            _register(source, response);
            _fetching.remove(source);
            _preFetchJobList.notifyFetched();

            while (_remoteQueue.sizeOf(source) > 0) {
              queue = _remoteQueue.getFrom(source);
              _execute(source, queue.bindParams, queue.callback);
            }
          },
        });
      }
    };
  })();

  const _execute = function (source, bindParams, callback) {
    if (_templates.has(source)) {
      if (typeof callback === 'function') {
        callback(_bind(source, bindParams));
      } else {
        return _bind(source, bindParams);
      }
    } else if (_isRemoteFile(source)) {
      if (typeof callback === 'function') {
        _registerFromRemote(source);
        _remoteQueue.addTo(source, {
          bindParams: bindParams,
          callback: callback,
        });
      }
    }
  };

  const _bind = function (source, bindParams) {
    const evaluator = new Evaluator(_filterManager);

    try {
      return evaluator.evaluate(_templates.get(source), [bindParams]);
    } catch (e) {
      throw new Error('template - ' + e.message + ' in source ' + source);
    }
  };

  // APIs.
  that.bind = function (source, bindParams) {
    return {
      get: function (callback) {
        if (typeof callback === 'function') {
          _execute(source, bindParams, function (output) {
            callback(output);
          });
        } else {
          return _execute(source, bindParams);
        }
      },
      //appendTo: function(target) {
      //  _execute(source, bindParams, function(output) {
      //    $(output).appendTo(target);
      //  });
      //},
      //insertBefore: function(target) {
      //  _execute(source, bindParams, function(output) {
      //    $(output).insertBefore(target);
      //  });
      //},
    };
  };

  that.addFilter = function (name, func) {
    _filterManager.register(name, func);
  };

  that.preFetch = function (source, callback) {
    const sourceList = (typeof source === 'string') ? [].concat(source) : source;

    if (Array.isArray(sourceList)) {
      sourceList.forEach(function (source) {
        if (_isRemoteFile(source)) {
          _registerFromRemote(source);
        }
      });

      _preFetchJobList.add(sourceList, callback);
    }
    return that;
  };

  that.clearTemplateCache = function (source) {
    if (typeof source === 'string') {
      _templates.remove(source);
    } else {
      _templates.clear();
    }
    return that;
  };

  registerPredefinedFilters(_filterManager);

  return that;
};

/**
 * @param {FilterManager} filterManager
 */
const registerPredefinedFilters = (filterManager) => {
  filterManager.register('h', (() => {
    const list = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#039;', // eslint-disable-line quotes
    };

    return (value) => {
      return value.replace(/[<>&"']/g, (matched) => {
        return list[matched];
      });
    };
  })());

  filterManager.register('default', (value, defaultValue) => {
    return value.length === 0 ? defaultValue : value;
  });

  filterManager.register('upper', (value) => {
    return value.toLocaleUpperCase();
  });

  filterManager.register('lower', (value) => {
    return value.toLocaleLowerCase();
  });

  filterManager.register('plus', (value, plus) => {
    if (isFinite(value) && typeof plus === 'number' && isFinite(plus)) {
      return (+(value) + plus).toString();
    } else {
      return value;
    }
  });
};

module.exports.init = function () {
  return template();
};
