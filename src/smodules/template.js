smodules.template = (function() {
    var _filters = {};

    var _parse = (function() {
        var _expr;

        var exception = function(message) {
            throw new Error("smodules.template parse error - " + message + " in " + _expr);
        };

        var getKeys = function(inner) {
            return (inner + " ").slice(0, inner.indexOf("|")).trim().split(".");
        };

        var getFilters = (function() {
            var expr, ptr, len;

            var current = function() {
                return expr.charAt(ptr);
            };

            var next = function(word) {
                if (word && current() !== word) {
                    exception("args");
                }
                ptr++;
            };

            var skipWhitespace = function() {
                var matched;

                if ((matched = expr.slice(ptr).match(/^\s+/))) {
                    ptr += matched[0].length;
                }
            };

            var getFilterName = function() {
                var matched;

                if ((matched = expr.slice(ptr).match(/^\w+/))) {
                    ptr += matched[0].length;
                } else {
                    exception("filter name");
                }
                return matched[0];
            };

            var getFilterArgs = (function() {
                var getString = function(sign) {
                    var s = "", c;

                    next(sign);
                    while (ptr < len) {
                        c = current();
                        if (c === sign) {
                            next(c);
                            if (s.slice(-1) === "\\") {
                                s = s.slice(0, -1) + c;
                            } else {
                                break;
                            }
                        } else {
                            s += c;
                            next(c);
                            if (ptr === len) {
                                exception("invalid string expression in args");
                            }
                        }
                    }
                    return s;
                };

                var getTrue = function() {
                    next("t");
                    next("r");
                    next("u");
                    next("e");
                    return true;
                };

                var getFalse = function() {
                    next("f");
                    next("a");
                    next("l");
                    next("s");
                    next("e");
                    return false;
                };

                var getNull = function() {
                    next("n");
                    next("u");
                    next("l");
                    next("l");
                    return null;
                };

                var getNumber = function() {
                    var number, matched;

                    if ((matched = expr.slice(ptr).match(/^\-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][\+\-]?\d+)?/))) {
                        number = +(matched[0]);
                    }
                    if (isNaN(number)) {
                        exception("invalid number expression in args");
                    } else {
                        ptr += matched[0].length;
                    }
                    return number;
                };

                return function() {
                    var args = [], c;

                    while (ptr < len) {
                        skipWhitespace();

                        c = current();
                        if (c === "'" || c === '"') {
                            args.push(getString(c));
                        } else if (c === "t") {
                            args.push(getTrue());
                        } else if (c === "f") {
                            args.push(getFalse());
                        } else if (c === "n") {
                            args.push(getNull());
                        } else if (c === "-" || (c >= "0" && c <= "9")) {
                            args.push(getNumber());
                        } else {
                            exception("filter args");
                        }

                        skipWhitespace();
                        c = current();
                        if (c === ",") {
                            next(",");
                        } else if (c === "|") {
                            break;
                        }
                    }

                    return args;
                };
            })();

            return function(inner) {
                var c, filter, filters = [];

                expr = (inner + " ").slice(inner.indexOf("|")).trim();
                ptr  = 0;
                len  = expr.length;

                while (ptr < len) {
                    filter = {};

                    next("|");
                    skipWhitespace();

                    filter.name = getFilterName();

                    skipWhitespace();

                    c = current();
                    if (c === ":") {
                        next(":");
                        filter.args = getFilterArgs();
                    } else if (c === "|" || c === "") {
                        filter.args = [];
                    } else {
                        exception("syntax error");
                    }

                    filters.push(filter);
                }

                return filters;
            };
        })();

        return function(expr, inner) {
            _expr = expr;

            return {
                expr:    expr,
                keys:    getKeys(inner),
                filters: getFilters(inner)
            };
        };
    })();

    var _templates = {};

    var _isRemoteFile = function(templateSrc) {
        return templateSrc.match(/\.html$/);
    };

    var _isEmbedded = function(templateSrc) {
        return templateSrc.indexOf("#") === 0;
    };

    var _register = function(templateSrc, content) {
        var matched,
            regex = /\{\{\s*([\s\S]+?)\s*\}\}/g,

            tmp     = [],
            holders = [];

        while ((matched = regex.exec(content))) {
            if ($.inArray(matched[0], tmp) < 0) {
                holders.push(_parse(matched[0], matched[1]));
            }
        }

        _templates[templateSrc] = {
            content: content,
            holders: holders
        };
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

        var getValue = function(keys, bindParams) {
            var i = 0, len = keys.length, value = bindParams;

            for ( ; i < len; i++) {
                if (typeof value[keys[i]] !== "undefined") {
                    value = value[keys[i]];
                } else {
                    value = "";
                    break;
                }
            }

            return value;
        };

        var getFilter = function(name) {
            if (typeof _filters[name] === "function") {
                return _filters[name];
            } else {
                throw new Error("smodules.template filter not found - " + name + " in " + src);
            }
        };

        var applyFilters = function(value, filters) {
            filters.forEach(function(filter) {
                value = getFilter(filter.name).apply(null, [value].concat(filter.args));
            });

            return value;
        };

        return function(templateSrc, bindParams) {
            var value, result = _templates[templateSrc].content;

            src = templateSrc;
            _templates[templateSrc].holders.forEach(function(holder) {
                result = result.replace(holder.expr, applyFilters(getValue(holder.keys, bindParams), holder.filters));
            });

            return result;
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
