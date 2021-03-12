const Evaluator = require('./evaluator');
const FilterManager = require('./filter-manager');
const Hash = require('./data.hash');
const QueueHash = require('./data.queueHash');
const Parser = require('./parser');

class AstCache {
  /**
   * @param {Evaluator} evaluator
   */
  constructor(evaluator) {
    this._parser = new Parser();
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
    this._queueHash.pushTo(source, {
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
      queue = this._queueHash.popFrom(source);
      queue.callback(this._astCache.evaluate(source, queue.param));
    }
  }
}

class PrefetchJob {
  /**
   * @param {string[]} sourceList
   * @param {function} callback
   */
  constructor(sourceList, callback) {
    this._sourceList = sourceList;
    this._callback = callback;
  }

  /**
   * @return {string[]}
   */
  getSourceList() {
    return this._sourceList;
  }

  executeCallback() {
    if (typeof this._callback === 'function') {
      this._callback();
    }
  }
}

class PrefetchManager {
  /**
   * @param {AstCache} astCache
   */
  constructor(astCache) {
    /**
     * @type {PrefetchJob[]}
     * @private
     */
    this._jobList = [];
    this._astCache = astCache;
  }

  /**
   * @param {string[]} sourceList
   * @param {function} callback
   */
  add(sourceList, callback) {
    this._jobList.push(new PrefetchJob(sourceList, callback));
  }

  notifyFetched() {
    /**
     * @type {PrefetchJob[]}
     */
    const undone = [];

    /**
     * @type {PrefetchJob[]}
     */
    const finished = [];

    this._jobList.forEach((job) => {
      const uncached = job.getSourceList().filter((source) => {
        return !this._astCache.has(source);
      });

      if (uncached.length > 0) {
        undone.push(job);
      } else {
        finished.push(job);
      }
    });

    this._jobList = undone;

    finished.forEach((job) => {
      job.executeCallback();
    })
  }
}

class RemoteManager {
  /**
   * @param {AstCache} astCache
   */
  constructor(astCache) {
    this._astCache = astCache;
    this._prefetchManager = new PrefetchManager(astCache);
    this._remoteQueue = new RemoteQueue(astCache);
    this._fetching = new Hash();
  }

  /**
   * @param {string} source
   * @param {Object} data
   */
  register(source, data) {
    if (data.render) {
      this._remoteQueue.push(source, data.render);
    }

    if (this._astCache.has(source)) {
      this._remoteQueue.consume(source);
    } else {
      if (this._fetching.has(source)) {
        return;
      }

      this._fetching.add(source, true);
      this._fetchRemoteSource(source, (content) => {
        if (data.check && typeof data.check.callback === 'function') {
          data.check.callback(source);
        }

        this._astCache.save(source, content);
        this._fetching.remove(source);
        this._prefetchManager.notifyFetched();
        this._remoteQueue.consume(source);
      });
    }
  }

  /**
   * @param {string[]} sourceList
   * @param {function} callback
   * @param {function} checkCallback
   */
  prefetch(sourceList, callback, checkCallback) {
    this._prefetchManager.add(sourceList, callback);

    sourceList.forEach((source) => {
      this.register(source, {
        check: {
          callback: checkCallback,
        },
      });
    });
  }

  /**
   * @param {string} source
   * @param {function} callback
   * @private
   */
  _fetchRemoteSource(source, callback) {
    const req = new XMLHttpRequest();

    req.open('GET', source, true);
    req.onreadystatechange = () => {
      if (req.readyState !== 4 || req.status !== 200) {
        return;
      }

      callback(req.responseText);
    };
    req.send();
  }
}

class Template {
  constructor() {
    this._filterManager = new FilterManager();
    this._astCache = new AstCache(new Evaluator(this._filterManager));
    this._remoteManager = new RemoteManager(this._astCache);

    registerPredefinedFilters(this._filterManager);
  }

  /**
   * @param {string} source
   * @param {Object} param
   * @return {string}
   * @throws {Error}
   */
  render(source, param) {
    this._astCache.save(source, source);

    return this._astCache.evaluate(source, param);
  }

  /**
   * @param {string} source
   * @param {Object} param
   * @param {function} callback
   * @throws {Error}
   */
  renderAsync(source, param, callback) {
    this._remoteManager.register(source, {
      render: {
        param: param,
        callback: callback,
      },
    });
  }

  /**
   * @param {string|string[]} target
   * @param {function} callback Called once when all sources fetched.
   * @param {function} [checkCallback] Called every time when a source fetched.
   */
  prefetch(target, callback, checkCallback) {
    const sourceList = (typeof target === 'string') ? [].concat(target) : target;

    this._remoteManager.prefetch(sourceList, callback, checkCallback);
  }

  /**
   * @param {string} name
   * @param {function} func
   */
  addFilter(name, func) {
    this._filterManager.register(name, func);
  }

  clearTemplateCache() {
    this._astCache.clear();
  }
}

/**
 * @param {FilterManager} filterManager
 */
const registerPredefinedFilters = (filterManager) => {
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

module.exports = Template;
