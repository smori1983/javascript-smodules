smodules.template = (function() {
    var _filters = {};

    var _templates = {};

    var _isRemoteFile = function(templateSrc) {
        return templateSrc.match(/\.html$/);
    };

    var _isEmbedded = function(templateSrc) {
        return templateSrc.indexOf("#") === 0;
    };

    var _register = function(templateSrc, content) {
        _templates[templateSrc] = smodules.templateParser.parse(content, templateSrc);
    };

    var _registerFromRemote = function(templateSrc, callback) {
        $.ajax({
            url: templateSrc,
            success: function(response) {
                _register(templateSrc, response);
                if (typeof callback === "function") {
                    callback();
                }
            }
        });
    };

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
        if (_templates.hasOwnProperty(templateSrc)) {
            _executeRecursive(templateSrc, bindParams, callback);
        } else if (_isRemoteFile(templateSrc)) {
            _registerFromRemote(templateSrc, function() {
                _executeRecursive(templateSrc, bindParams, callback);
            });
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
            if (typeof _filters[name] === "function") {
                return _filters[name];
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

            return loop(_templates[templateSrc], [bindParams]);
        };
    })();


    // APIs.
    var that = function(templateFile, bindParams) {
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
        _filters[name] = func;
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

    return that;
})();


// default filters
smodules.template.addFilter("h", (function() {
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

smodules.template.addFilter("default", function(value, defaultValue) {
    return value.length === 0 ? defaultValue : value;
});

smodules.template.addFilter("upper", function(value) {
    return value.toLocaleUpperCase();
});

smodules.template.addFilter("lower", function(value) {
    return value.toLocaleLowerCase();
});

smodules.template.addFilter("plus", function(value, plus) {
    if (/^\d+$/.test(value) && typeof plus === "number" && isFinite(plus)) {
        return (+(value) + plus).toString();
    } else {
        return value;
    }
});
