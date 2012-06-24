smodules.template = function() {
    var that = {};

    var _filters = smodules.data.hash();

    var _templates = smodules.data.hash();

    var _parser = smodules.templateParser();

    var _remoteQueue = smodules.data.queueHash();

    var _testRemoteFile = function(file) {
        return (/\.html$/).test(file);
    };

    var _isRemoteFile = function(templateSrc) {
        return _testRemoteFile(templateSrc);
    };

    var _isEmbedded = function(templateSrc) {
        return templateSrc.indexOf("#") === 0;
    };

    var _register = function(templateSrc, content) {
        _templates.add(templateSrc, _parser.parse(content, templateSrc));
    };

    var _registerFromRemote = (function() {
        var _fetching = smodules.data.hash();

        return function(templateSrc) {
            if (!_fetching.has(templateSrc)) {
                _fetching.add(templateSrc, true);

                $.ajax({
                    url: templateSrc,
                    success: function(response) {
                        var queue;

                        _fetching.remove(templateSrc);
                        _register(templateSrc, response);
        
                        while (_remoteQueue.sizeOf(templateSrc) > 0) {
                            queue = _remoteQueue.getFrom(templateSrc);
                            _executeRecursive(templateSrc, queue.bindParams, queue.callback);
                        }
                    }
                });
            }
        };
    })();

    var _registerFromHTML = function(templateSrc, callback) {
        if ($(templateSrc)[0].tagName.toLowerCase() === "textarea") {
            _register(templateSrc, $(templateSrc).val());
        } else {
            _register(templateSrc, $(templateSrc).html());
        }
        if (typeof callback === "function") {
            callback();
        }
    };

    var _registerFromString = function(templateSrc, callback) {
        _register(templateSrc, templateSrc);
        if (typeof callback === "function") {
            callback();
        }
    };

    var _execute = function(templateSrc, bindParams, callback) {
        if (_templates.has(templateSrc)) {
            _executeRecursive(templateSrc, bindParams, callback);
        } else if (_isRemoteFile(templateSrc)) {
            _registerFromRemote(templateSrc);
            _remoteQueue.addTo(templateSrc, { bindParams: bindParams, callback: callback });
        } else if (_isEmbedded(templateSrc)) {
            _registerFromHTML(templateSrc, function() {
                _executeRecursive(templateSrc, bindParams, callback);
            });
        } else {
            _registerFromString(templateSrc, function() {
                _executeRecursive(templateSrc, bindParams, callback);
            });
        }
    };

    var _executeRecursive = function(templateSrc, bindParams, callback) {
        if (!$.isArray(bindParams)) {
            bindParams = [bindParams];
        }

        $.each(bindParams, function(idx, params) {
            callback(_bind(templateSrc, params));
        });
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
            filters.forEach(function(filter) {
                value = getFilter(filter.name).apply(null, [value].concat(filter.args));
            });

            return value;
        };

        var loop = function(blocks, params) {
            return blocks.reduce(function(output, block) {
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
                return lval == rval;
            } else if (comp === "!==") {
                return lval !== rval;
            } else if (comp === "!=") {
                return lval != rval;
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
            var i = 0, len = block.sections.length, section, sectionResult, output = "";

            for ( ; i < len; i++) {
                section = block.sections[i];

                if (section.header.type === "if" || section.header.type === "elseif") {
                    if ((sectionResult = evaluate(section.header.stack, params))) {
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
                array.forEach(function(value, idx) {
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

        return function(templateSrc, bindParams) {
            src = templateSrc;

            return loop(_templates.get(templateSrc), [bindParams]);
        };
    })();


    // APIs.
    that.bind = function(templateFile, bindParams) {
        return {
            get: function(callback) {
                _execute(templateFile, bindParams, function(response) {
                    callback(response);
                });
            },
            appendTo: function(target) {
                _execute(templateFile, bindParams, function(response) {
                    $(response).appendTo(target);
                });
            },
            insertBefore: function(target) {
                _execute(templateFile, bindParams, function(response) {
                    $(response).insertBefore(target);
                });
            }
        };
    };

    that.addFilter = function(name, func) {
        if (typeof func === "function") {
            _filters.add(name, func);
        }
        return that;
    };

    that.preFetch = function(templateSrc) {
        if (_isRemoteFile(templateSrc)) {
            _registerFromRemote(templateSrc);
        } else if (_isEmbedded(templateSrc)) {
            _registerFromHTML(templateSrc);
        } else {
            _registerFromString(templateSrc);
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
            "'": "&#039;"
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
