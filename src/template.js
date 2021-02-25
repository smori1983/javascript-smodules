const Evaluator = require('./evaluator');
const FilterManager = require('./filter-manager');
const Hash = require('./data.hash');
const QueueHash = require('./data.queueHash');
const parser = require('./parser');

class PrefetchManager {
  /**
   * @param {Hash} templates
   */
  constructor(templates) {
    this._jobList = [];
    this._templates = templates;
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
        return !this._templates.has(source);
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

  const _evaluator = new Evaluator(_filterManager);

  const _templates = new Hash();

  const _parser = parser.init();

  const _remoteQueue = new QueueHash();

  const _preFetchJobList = new PrefetchManager(_templates);

  /**
   * @param {string} source
   * @return {boolean}
   */
  const _isRemoteFile = (source) => {
    return (/\.html$/).test(source);
  };

  /**
   * @param {string} source
   * @param {string} content
   */
  const _register = (source, content) => {
    _templates.add(source, _parser.parse(content, source));
  };

  const _registerFromRemote = (() => {
    const _fetching = new Hash();

    return (source, checkCallback) => {
      if (_fetching.has(source)) {
        return;
      }

      _fetching.add(source, true);

      const req = new XMLHttpRequest();
      req.open('GET', source, true);
      req.onreadystatechange = () => {
        if (req.readyState !== 4 || req.status !== 200) {
          return;
        }

        let queue;

        if (typeof checkCallback === 'function') {
          checkCallback(source);
        }

        _register(source, req.responseText);
        _fetching.remove(source);
        _preFetchJobList.notifyFetched();

        while (_remoteQueue.sizeOf(source) > 0) {
          queue = _remoteQueue.getFrom(source);
          _execute(source, queue.bindParams, queue.callback);
        }
      };
      req.send();
    };
  })();

  /**
   * @param {string} source
   * @param {Object} bindParams
   * @param {function} [callback]
   */
  const _execute = (source, bindParams, callback) => {
    if (_templates.has(source)) {
      if (typeof callback === 'function') {
        callback(_evaluate(source, bindParams));
      } else {
        return _evaluate(source, bindParams);
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

  /**
   * @param {string} source
   * @param {Object} bindParams
   * @return {string}
   */
  const _evaluate = (source, bindParams) => {
    try {
      return _evaluator.evaluate(_templates.get(source), [bindParams]);
    } catch (e) {
      throw new Error('template - ' + e.message + ' in source ' + source);
    }
  };

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
   */
  that.render = (source, param) => {
    return _execute(source, param);
  };

  /**
   * @param {string} source
   * @param {Object} param
   * @param {function} callback
   */
  that.renderAsync = (source, param, callback) => {
    _execute(source, param, callback);
  };

  /**
   * @param {string} source
   * @param {function} callback
   * @param {function} [checkCallback] Called every time when a source fetched.
   */
  that.prefetch = (source, callback, checkCallback) => {
    const sourceList = (typeof source === 'string') ? [].concat(source) : source;

    if (Array.isArray(sourceList)) {
      sourceList.forEach((source) => {
        if (_isRemoteFile(source)) {
          _registerFromRemote(source, checkCallback);
        }
      });

      _preFetchJobList.add(sourceList, callback);
    }
  };

  that.clearTemplateCache = () => {
    _templates.clear();
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
