const FilterManager = require('./filter-manager');
const Hash = require('./data.hash');
const QueueHash = require('./data.queueHash');
const templateParser = require('./templateParser');

const template = function() {
  const that = {};

  const _filterManager = new FilterManager();

  const _templates = new Hash();

  const _parser = templateParser.init();

  const _remoteQueue = new QueueHash();

  let _testRemoteFile = function (file) {
    return (/\.html$/).test(file);
  };

  const _isRemoteFile = function (source) {
    return _testRemoteFile(source);
  };

  const _isEmbedded = function (source) {
    return source.indexOf('#') === 0;
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
        jobList.push({sourceList: sourceList, callback: callback});
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

  const _registerFromHTML = function (source, callback) {
    if ($(source)[0].tagName.toLowerCase() === 'textarea') {
      _register(source, $(source).val());
    } else {
      _register(source, $(source).html());
    }
    if (typeof callback === 'function') {
      callback();
    }
  };

  const _registerFromString = function (source, callback) {
    _register(source, source);
    if (typeof callback === 'function') {
      callback();
    }
  };

  const _execute = function(source, bindParams, callback) {
    if (_templates.has(source)) {
      if (typeof callback === 'function') {
        callback(_bind(source, bindParams));
      } else {
        return _bind(source, bindParams);
      }
    } else if (_isRemoteFile(source)) {
      if (typeof callback === 'function') {
        _registerFromRemote(source);
        _remoteQueue.addTo(source, { bindParams: bindParams, callback: callback });
      }
    } else if (_isEmbedded(source)) {
      _registerFromHTML(source);
      if (typeof callback === 'function') {
        callback(_bind(source, bindParams));
      } else {
        return _bind(source, bindParams);
      }
    } else {
      _registerFromString(source);
      if (typeof callback === 'function') {
        callback(_bind(source, bindParams));
      } else {
        return _bind(source, bindParams);
      }
    }
  };

  const _bind = (function() {
    let src;

    const exception = function (message) {
      throw new Error('smodules.template - ' + message + ' in source ' + src);
    };

    const getValue = function (keys, params, asis) {
      let pIdx, i, len, value;

      for (pIdx = params.length - 1; pIdx >= 0; pIdx--) {
        value = params[pIdx];
        for (i = 0, len = keys.length; i < len; i++) {
          if (typeof value[keys[i]] === 'undefined') {
            value = null;
            break;
          } else {
            value = value[keys[i]];
          }
        }
        if (i === len) {
          break;
        }
      }

      if (asis) {
        return value;
      } else {
        return value === null ? '' : value.toString();
      }
    };

    const getFilter = function (name) {
      try {
        return _filterManager.get(name);
      } catch (e) {
        exception(e.message);
      }
    };

    const applyFilters = function (value, filters) {
      filters.forEach(function (filter) {
        value = getFilter(filter.name).apply(null, [value].concat(filter.args));
      });

      return value;
    };

    const loop = function (blocks, params) {
      return blocks.reduce(function (output, block) {
        if (block.type === 'normal' || block.type === 'literal') {
          return output + block.value;
        } else if (block.type === 'holder') {
          return output + applyFilters(getValue(block.keys, params), block.filters);
        } else if (block.type === 'if') {
          return output + loopIf(block, params);
        } else if (block.type === 'for') {
          return output + loopFor(block, params);
        } else {
          return output;
        }
      }, '');
    };

    const evaluateComp = function (lval, rval, comp) {
      if (comp === '===') {
        return lval === rval;
      } else if (comp === '==') {
        return lval == rval; // eslint-disable-line eqeqeq
      } else if (comp === '!==') {
        return lval !== rval;
      } else if (comp === '!=') {
        return lval != rval; // eslint-disable-line eqeqeq
      } else if (comp === 'lte') {
        return lval <= rval;
      } else if (comp === 'lt') {
        return lval < rval;
      } else if (comp === 'gte') {
        return lval >= rval;
      } else if (comp === 'gt') {
        return lval > rval;
      } else {
        exception('invalid comparer');
      }
    };

    const evaluateAndOr = function (lval, rval, type) {
      if (type === 'and') {
        return lval && rval;
      } else if (type === 'or') {
        return lval || rval;
      } else {
        exception('unknown operator');
      }
    };

    const evaluate = function (conditions, params) {
      let result = [], i, len, section, lval, rval;

      for (i = 0, len = conditions.length; i < len; i++) {
        section = conditions[i];

        if (section.type === 'value') {
          result.push(section.value || section.expr);
        } else if (section.type === 'var') {
          result.push(getValue(section.keys, params, true));
        } else if (section.type === 'comp') {
          rval = result.pop();
          lval = result.pop();
          result.push(evaluateComp(lval, rval, section.expr));
        } else if (section.type === 'andor') {
          rval = result.pop();
          lval = result.pop();
          result.push(evaluateAndOr(lval, rval, section.expr));
        }
      }

      if (result.length !== 1) {
        exception('invalid condition expression');
      }

      return result[0];
    };

    const loopIf = function(block, params) {
      let i, len, section;
      let output = '';

      for (i = 0, len = block.sections.length; i < len; i++) {
        section = block.sections[i];

        if (section.header.type === 'if' || section.header.type === 'elseif') {
          if (evaluate(section.header.ctrl.stack, params)) {
            output = loop(section.blocks, params);
            break;
          }
        } else {
          output = loop(section.blocks, params);
        }
      }

      return output;
    };

    const loopFor = function(block, params) {
      const array = getValue(block.ctrl.keys, params, true);
      let output = '';

      if (Array.isArray(array)) {
        array.forEach(function(value, idx) {
          const additional = {};

          if (block.ctrl.tmp_k) {
            additional[block.ctrl.tmp_k] = idx;
          }
          additional[block.ctrl.tmp_v] = value;

          params.push(additional);
          output += loop(block.children, params);
          params.pop();
        });
      }

      return output;
    };

    return function(source, bindParams) {
      src = source;

      return loop(_templates.get(source), [bindParams]);
    };
  })();


  // APIs.
  that.bind = function(source, bindParams) {
    return {
      get: function(callback) {
        if (typeof callback === 'function') {
          _execute(source, bindParams, function(output) {
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

  that.addFilter = function(name, func) {
    _filterManager.register(name, func);
  };

  that.preFetch = function(source, callback) {
    const sourceList = (typeof source === 'string') ? [].concat(source) : source;

    if (Array.isArray(sourceList)) {
      sourceList.forEach(function(source) {
        if (_isRemoteFile(source)) {
          _registerFromRemote(source);
        } else if (_isEmbedded(source)) {
          _registerFromHTML(source);
        } else {
          _registerFromString(source);
        }
      });

      _preFetchJobList.add(sourceList, callback);
    }
    return that;
  };

  that.setRemoteFilePattern = function (arg) {
    if (typeof arg === 'string') {
      _testRemoteFile = function (file) {
        return file.indexOf(arg) === 0;
      };
    } else if (typeof arg === 'object' && typeof arg.test === 'function' && (/^\/.+\/$/).test(arg.toString())) {
      _testRemoteFile = function (file) {
        return arg.test(file);
      };
    }
    return that;
  };

  that.getTemplateCacheList = function() {
    return _templates.getKeys();
  };

  that.clearTemplateCache = function(source) {
    if (typeof source === 'string') {
      _templates.remove(source);
    } else {
      _templates.clear();
    }
    return that;
  };

  // default filters
  _filterManager.register('h', (function () {
    const list = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#039;', // eslint-disable-line quotes
    };

    return function(value) {
      return value.replace(/[<>&"']/g, function (matched) {
        return list[matched];
      });
    };
  })());

  _filterManager.register('default', function (value, defaultValue) {
    return value.length === 0 ? defaultValue : value;
  });

  _filterManager.register('upper', function (value) {
    return value.toLocaleUpperCase();
  });

  _filterManager.register('lower', function (value) {
    return value.toLocaleLowerCase();
  });

  _filterManager.register('plus', function (value, plus) {
    if (isFinite(value) && typeof plus === 'number' && isFinite(plus)) {
      return (+(value) + plus).toString();
    } else {
      return value;
    }
  });

  return that;
};

module.exports.init = function () {
  return template();
};
