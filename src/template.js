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

  const _prefetchManager = new PrefetchManager(_templates);

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
    const _remoteQueue = new QueueHash();
    const _fetching = new Hash();

    return (source, data) => {
      if (data.render) {
        _remoteQueue.addTo(source, {
          bindParams: data.render.bindParams,
          callback: data.render.callback,
        });
      }

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

        if (data.check && typeof data.check.callback === 'function') {
          data.check.callback(source);
        }

        _register(source, req.responseText);
        _fetching.remove(source);
        _prefetchManager.notifyFetched();

        while (_remoteQueue.sizeOf(source) > 0) {
          queue = _remoteQueue.getFrom(source);
          queue.callback(_evaluate(source, queue.bindParams));
        }
      };
      req.send();
    };
  })();

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
    if (!_templates.has(source)) {
      _register(source, source);
    }

    return _evaluate(source, param);
  };

  /**
   * @param {string} source
   * @param {Object} param
   * @param {function} callback
   */
  that.renderAsync = (source, param, callback) => {
    _registerFromRemote(source, {
      render: {
        bindParams: param,
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

    if (Array.isArray(sourceList)) {
      sourceList.forEach((source) => {
        if (_isRemoteFile(source)) {
          _registerFromRemote(source, {
            check: {
              callback: checkCallback,
            },
          });
        }
      });

      _prefetchManager.add(sourceList, callback);
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
