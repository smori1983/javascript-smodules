smodules.template = function() {
    var that = {};

    var _filters = smodules.data.hash();

    var _templates = smodules.data.hash();

    var _parser = smodules.templateParser();

    var _remoteQueue = smodules.data.queueHash();

    var _testRemoteFile = function(file) {
        return (/\.html$/).test(file);
    };

    var _isRemoteFile = function(source) {
        return _testRemoteFile(source);
    };

    var _isEmbedded = function(source) {
        return source.indexOf("#") === 0;
    };

    var _preFetchJobList = (function() {
        var jobList = [];

        var check = function() {
            var finished = [];

            smodules.a.forEach(jobList, function(job) {
                job.sourceList = smodules.a.filter(job.sourceList, function(source) {
                    return !_templates.has(source);
                });

                if (job.sourceList.length === 0) {
                    finished.push(job);
                }
            });

            jobList = smodules.a.filter(jobList, function(job) {
                return job.sourceList.length > 0;
            });

            smodules.a.forEach(finished, function(job) {
                if (typeof job.callback === "function") {
                    job.callback();
                }
            });
        };

        return {
            add: function(sourceList, callback) {
                jobList.push({ sourceList: sourceList, callback: callback });
                check();
            },
            notifyFetched: function() {
                check();
            },
        };
    })();

    var _register = function(source, content) {
        _templates.add(source, _parser.parse(content, source));
    };

    var _registerFromRemote = (function() {
        var _fetching = smodules.data.hash();

        return function(source) {
            if (!_fetching.has(source)) {
                _fetching.add(source, true);

                $.ajax({
                    url: source,
                    success: function(response) {
                        var queue;

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

    var _registerFromHTML = function(source, callback) {
        if ($(source)[0].tagName.toLowerCase() === "textarea") {
            _register(source, $(source).val());
        } else {
            _register(source, $(source).html());
        }
        if (typeof callback === "function") {
            callback();
        }
    };

    var _registerFromString = function(source, callback) {
        _register(source, source);
        if (typeof callback === "function") {
            callback();
        }
    };

    var _execute = function(source, bindParams, callback) {
        if (_templates.has(source)) {
            if (typeof callback === "function") {
                callback(_bind(source, bindParams));
            } else {
                return _bind(source, bindParams);
            }
        } else if (_isRemoteFile(source)) {
            if (typeof callback === "function") {
                _registerFromRemote(source);
                _remoteQueue.addTo(source, { bindParams: bindParams, callback: callback });
            }
        } else if (_isEmbedded(source)) {
            _registerFromHTML(source);
            if (typeof callback === "function") {
                callback(_bind(source, bindParams));
            } else {
                return _bind(source, bindParams);
            }
        } else {
            _registerFromString(source);
            if (typeof callback === "function") {
                callback(_bind(source, bindParams));
            } else {
                return _bind(source, bindParams);
            }
        }
    };

    var _bind = (function() {
        var src;

        var exception = function(message) {
            throw new Error("smodules.template - " + message + " in source " + src);
        };

        var getValue = function(keys, params, asis) {
            var pIdx = params.length - 1, i, len = keys.length, value;

            for ( ; pIdx >= 0; pIdx--) {
                value = params[pIdx];
                for (i = 0; i < len; i++) {
                    if (typeof value[keys[i]] === "undefined") {
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
                return value === null ? "" : value.toString();
            }
        };

        var getFilter = function(name) {
            if (_filters.has(name)) {
                return _filters.get(name);
            } else {
                exception("filter '" + name + "' not found");
            }
        };

        var applyFilters = function(value, filters) {
            smodules.a.forEach(filters, function(filter) {
                value = getFilter(filter.name).apply(null, [value].concat(filter.args));
            });

            return value;
        };

        var loop = function(blocks, params) {
            return smodules.a.reduce(blocks, function(output, block) {
                if (block.type === "normal" || block.type === "literal") {
                    return output + block.expr;
                } else if (block.type === "holder") {
                    return output + applyFilters(getValue(block.keys, params), block.filters);
                } else if (block.type === "if") {
                    return output + loopIf(block, params);
                } else if (block.type === "for") {
                    return output + loopFor(block, params);
                } else {
                    return output;
                }
            }, "");
        };

        var evaluateComp = function(lval, rval, comp) {
            if (comp === "===") {
                return lval === rval;
            } else if (comp === "==") {
                return lval == rval; // eslint-disable-line eqeqeq
            } else if (comp === "!==") {
                return lval !== rval;
            } else if (comp === "!=") {
                return lval != rval; // eslint-disable-line eqeqeq
            } else if (comp === "lte") {
                return lval <= rval;
            } else if (comp === "lt") {
                return lval < rval;
            } else if (comp === "gte") {
                return lval >= rval;
            } else if (comp === "gt") {
                return lval > rval;
            } else {
                exception("invalid comparer");
            }
        };

        var evaluateAndOr = function(lval, rval, type) {
            if (type === "and") {
                return lval && rval;
            } else if (type === "or") {
                return lval || rval;
            } else {
                exception("unknown operator");
            }
        };

        var evaluate = function(conditions, params) {
            var result = [], i = 0, len = conditions.length, section, lval, rval;

            for ( ; i < len; i++) {
                section = conditions[i];

                if (section.type === "value") {
                    result.push(section.value || section.expr);
                } else if (section.type === "var") {
                    result.push(getValue(section.keys, params, true));
                } else if (section.type === "comp") {
                    rval = result.pop();
                    lval = result.pop();
                    result.push(evaluateComp(lval, rval, section.expr));
                } else if (section.type === "andor") {
                    rval = result.pop();
                    lval = result.pop();
                    result.push(evaluateAndOr(lval, rval, section.expr));
                }
            }

            if (result.length !== 1) {
                exception("invalid condition expression");
            }

            return result[0];
        };

        var loopIf = function(block, params) {
            var i = 0, len = block.sections.length, section, output = "";

            for ( ; i < len; i++) {
                section = block.sections[i];

                if (section.header.type === "if" || section.header.type === "elseif") {
                    if (evaluate(section.header.stack, params)) {
                        output = loop(section.blocks, params);
                        break;
                    }
                } else {
                    output = loop(section.blocks, params);
                }
            }

            return output;
        };

        var loopFor = function(block, params) {
            var array = getValue(block.header.array, params, true), output = "", additional;

            if ($.isArray(array)) {
                smodules.a.forEach(array, function(value, idx) {
                    additional = {};

                    if (block.header.k) {
                        additional[block.header.k] = idx;
                    }
                    additional[block.header.v] = value;

                    params.push(additional);
                    output += loop(block.blocks, params);
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
                if (typeof callback === "function") {
                    _execute(source, bindParams, function(output) {
                        callback(output);
                    });
                } else {
                    return _execute(source, bindParams);
                }
            },
            appendTo: function(target) {
                _execute(source, bindParams, function(output) {
                    $(output).appendTo(target);
                });
            },
            insertBefore: function(target) {
                _execute(source, bindParams, function(output) {
                    $(output).insertBefore(target);
                });
            },
        };
    };

    that.addFilter = function(name, func) {
        if (typeof func === "function") {
            _filters.add(name, func);
        }
        return that;
    };

    that.preFetch = function(source, callback) {
        var sourceList = (typeof source === "string") ? [].concat(source) : source;

        if ($.isArray(sourceList)) {
            smodules.a.forEach(sourceList, function(source) {
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

    that.setRemoteFilePattern = function(arg) {
        if (typeof arg === "string") {
            _testRemoteFile = function(file) {
                return file.indexOf(arg) === 0;
            };
        } else if (typeof arg === "object" && typeof arg.test === "function" && (/^\/.+\/$/).test(arg.toString())) {
            _testRemoteFile = function(file) {
                return arg.test(file);
            };
        }
        return that;
    };

    that.getTemplateCacheList = function() {
        return _templates.getKeys();
    };

    that.clearTemplateCache = function(source) {
        if (typeof source === "string") {
            _templates.remove(source);
        } else {
            _templates.clear();
        }
        return that;
    };

    // default filters
    that.addFilter("h", (function() {
        var list = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&#039;",
        };

        return function(value) {
            return value.replace(/[<>&"']/g, function(matched) {
                return list[matched];
            });
        };
    })());

    that.addFilter("default", function(value, defaultValue) {
        return value.length === 0 ? defaultValue : value;
    });

    that.addFilter("upper", function(value) {
        return value.toLocaleUpperCase();
    });

    that.addFilter("lower", function(value) {
        return value.toLocaleLowerCase();
    });

    that.addFilter("plus", function(value, plus) {
        if (isFinite(value) && typeof plus === "number" && isFinite(plus)) {
            return (+(value) + plus).toString();
        } else {
            return value;
        }
    });

    return that;
};
