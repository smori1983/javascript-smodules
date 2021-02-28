const Evaluator = require('./evaluator');
const FilterManager = require('./filter-manager');
const Hash = require('./data.hash');
const QueueHash = require('./data.queueHash');
const parser = require('./parser');

class AstCache {
  /**
   * @param {Evaluator} evaluator
   */
  constructor(evaluator) {
    this._parser = parser.init();
    this._evaluator = evaluator;
    this._cache = new Hash();
  }

  /**
   * @param {string} source
   * @param {string} content
   */
  save(source, content) {
    if (!this._cache.has(source)) {
      this._cache.add(source, this._parser.parse(content, source));
    }
  }

  /**
   * @param {string} source
   * @return {boolean}
   */
  has(source) {
    return this._cache.has(source);
  }

  /**
   * @param {string} source
   * @param {Object} param
   * @return {string}
   * @throws {Error}
   */
  evaluate(source, param) {
    try {
      return this._evaluator.evaluate(this._cache.get(source), [param]);
    } catch (e) {
      throw new Error('template - ' + e.message + ' in source ' + source);
    }
  }

  clear() {
    this._cache.clear();
  }
}

class RemoteQueue {
  /**
   * @param {AstCache} astCache
   */
  constructor(astCache) {
    this._astCache = astCache;
    this._queueHash = new QueueHash();
  }

  /**
   * @param {string} source
   * @param {{param: Object, callback: function}} data
   */
  push(source, data) {
    this._queueHash.addTo(source, {
      param: data.param,
      callback: data.callback,
    });
  }

  /**
   * @param {string} source
   * @throws {Error}
   */
  consume(source) {
    let queue;

    while (this._queueHash.sizeOf(source) > 0) {
      queue = this._queueHash.getFrom(source);
      queue.callback(this._astCache.evaluate(source, queue.param));
    }
  }
}

class PrefetchManager {
  /**
   * @param {AstCache} astCache
   */
  constructor(astCache) {
    this._jobList = [];
    this._astCache = astCache;
  }

  /**
   * @param {string[]} sourceList
   * @param {function} callback
   */
  add(sourceList, callback) {
    this._jobList.push({
      sourceList: sourceList,
      callback: callback,
    });
  }

  notifyFetched() {
    const undone = [];
    const finished = [];

    this._jobList.forEach((job) => {
      const unacquired = job.sourceList.filter((source) => {
        return !this._astCache.has(source);
      });

      if (unacquired.length > 0) {
        undone.push(job);
      } else {
        finished.push(job);
      }
    });

    this._jobList = undone;

    finished.forEach((job) => {
      if (typeof job.callback === 'function') {
        job.callback();
      }
    });
  }
}

const template = () => {
  const that = {};

  const _filterManager = new FilterManager();

  const _astCache = new AstCache(new Evaluator(_filterManager));

  const _prefetchManager = new PrefetchManager(_astCache);

  const _remoteQueue = new RemoteQueue(_astCache);

  const _registerFromRemote = (() => {
    const _fetching = new Hash();

    const _fetchRemoteSource = (source, data, callback) => {
      const req = new XMLHttpRequest();

      req.open('GET', source, true);
      req.onreadystatechange = () => {
        if (req.readyState !== 4 || req.status !== 200) {
          return;
        }

        callback(req.responseText);
      };
      req.send();
    };

    return (source, data) => {
      if (data.render) {
        _remoteQueue.push(source, data.render);
      }

      if (_astCache.has(source)) {
        _remoteQueue.consume(source);
      } else {
        if (_fetching.has(source)) {
          return;
        }

        _fetching.add(source, true);
        _fetchRemoteSource(source, data, (content) => {
          if (data.check && typeof data.check.callback === 'function') {
            data.check.callback(source);
          }

          _astCache.save(source, content);
          _fetching.remove(source);
          _prefetchManager.notifyFetched();
          _remoteQueue.consume(source);
        });
      }
    };
  })();

  /**
   * @param {string} name
   * @param {function} func
   */
  that.addFilter = (name, func) => {
    _filterManager.register(name, func);
  };

  /**
   * @param {string} source
   * @param {Object} param
   * @return {string}
   * @throws {Error}
   */
  that.render = (source, param) => {
    _astCache.save(source, source);

    return _astCache.evaluate(source, param);
  };

  /**
   * @param {string} source
   * @param {Object} param
   * @param {function} callback
   */
  that.renderAsync = (source, param, callback) => {
    _registerFromRemote(source, {
      render: {
        param: param,
        callback: callback,
      },
    });
  };

  /**
   * @param {string|string[]} target
   * @param {function} callback Called once when all sources fetched.
   * @param {function} [checkCallback] Called every time when a source fetched.
   */
  that.prefetch = (target, callback, checkCallback) => {
    const sourceList = (typeof target === 'string') ? [].concat(target) : target;

    sourceList.forEach((source) => {
      _registerFromRemote(source, {
        check: {
          callback: checkCallback,
        },
      });
    });

    _prefetchManager.add(sourceList, callback);
  };

  that.clearTemplateCache = () => {
    _astCache.clear();
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

module.exports.init = () => {
  return template();
};
