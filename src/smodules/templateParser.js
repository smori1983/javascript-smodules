smodules.templateParser = (function() {
    var that = {},
        src,
        text,
        ptr,
        ch,
        len,
        line,
        at;

    var exception = function(message) {
        throw new Error("smodules.templateParser - " + message + " in " + src + " [" + line + "," + at + "]");
    };

    var next = function(expr, replace) {
        expr = expr || ch;

        if (text.indexOf(expr, ptr) !== ptr) {
            exception("syntax error");
        }

        if (expr === "\n") {
            line++;
            at = 1;
        } else {
            at += expr.length;
        }

        ptr += expr.length;
        ch = text.charAt(ptr);

        return replace || expr;
    };

    var skipWhitespace = function() {
        var s = "";

        while (/\s/.test(ch)) {
            s += next(ch);
        }

        return s;
    };

    var read = function(expr) {
        return text.indexOf(expr, ptr) === ptr;
    };

    var parseNormal = function() {
        var s = "";

        while (ptr < len) {
            if (ch === "{") {
                if (read("{left}")) {
                    s += next("{left}", "{");
                } else if (read("{right}")) {
                    s += next("{right}", "}");
                } else {
                    break;
                }
            } else {
                s += next(ch);
            }
        }

        return {
            type: "normal",
            expr: s
        };
    };

    var parseLiteral = function() {
        var s = "", closed = false, beginLine = line, beginAt = at;

        next("{literal}");

        while (ptr < len) {
            if (ch === "{") {
                if (read("{left}")) {
                    s += next("{left}", "{");
                } else if (read("{right}")) {
                    s += next("{right}", "}");
                } else if (read("{/literal}")) {
                    next("{/literal}");
                    closed = true;
                    break;
                } else {
                    s += next(ch);
                }
            } else {
                s += next(ch);
            }
        }

        if (!closed) {
            exception("literal block starts at [" + beginLine + ", " + beginAt + "] not closed by {/literal}");
        }

        return {
            type: "literal",
            expr: s
        };
    };

    var parseHolder = (function() {
        var getKeySection = function() {
            var s = "";

            skipWhitespace();

            while (/[\w\.]/.test(ch)) {
                if (ch === ".") {
                    if (s.slice(-1) === "." || s.length === 0) {
                        exception("invalid variable expression");
                    }
                }
                s += next(ch);
            }

            if (s.slice(-1) === "." || s.length === 0) {
                exception("invalid variable expression");
            }

            return {
                expr: s,
                keys: s.split(".")
            };
        };

        var getFilterSection = (function() {
            var getFilterNameSection = function() {
                var s = "";

                skipWhitespace();

                while (/[\w\-]/.test(ch)) {
                    s += next(ch);
                }

                if (s === "") {
                    exception("filter name not found");
                }

                return {
                    name: s,
                    expr: s
                };
            };

            var getFilterArgsSection = (function() {
                var parseString = function() {
                    var startLine = line, startAt = at, closed = false, s = "", mark = next();

                    while (ptr < len) {
                        if (ch === mark) {
                            if (s.slice(-1) === "\\") {
                                s += next(ch);
                            } else {
                                next(ch);
                                closed = true;
                                break;
                            }
                        } else {
                            s += next(ch);
                        }
                    }

                    if (!closed || !/[\s\|\},]/.test(ch)) {
                        exception("string expression starts at [" + startLine + ", " + startAt + "] not closed");
                    }

                    return {
                        value: mark === "'" ? s.replace("\\'", "'") : s.replace('\\"', '"'),
                        expr:  mark + s + mark
                    };
                };

                var parseNumber = function() {
                    var s = "", value;

                    if (ch === "-" || ch === "+") {
                        s += next(ch);
                    }

                    if (ch === "0") {
                        s += next(ch);
                    } else {
                        while (ch >= "0" && ch <= "9") {
                            s += next(ch);
                        }
                    }

                    if (ch === ".") {
                        s += next(ch);

                        while (ch >= "0" && ch <= "9") {
                            s += next(ch);
                        }
                    }

                    if (ch === "e" || ch === "E") {
                        s += next(ch);

                        if (ch === "+" || ch === "-") {
                            s += next(ch);
                        }

                        while (ch >= "0" && ch <= "9") {
                            s += next(ch);
                        }
                    }

                    if (isNaN(value = +(s)) || !/[\s\|\},]/.test(ch)) {
                        exception("invalid number expression");
                    }
/*
                    var s, value, matched;

                    if ((matched = text.slice(ptr).match(/^[\-\+]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][\+\-]?\d+)?/))) {
                        value = +(matched[0]);
                    }

                    if (isNaN(value)) {
                        exception("invalid number expression");
                    } else {
                        s = next(matched[0]);
                    }
*/
                    return {
                        value: value,
                        expr:  s
                    };
                };

                return function() {
                    var s = "", args = [], arg;

                    skipWhitespace();

                    if (ch === ":") {
                        s += next(ch);

                        while (ptr < len) {
                            skipWhitespace();

                            if (ch === "'" || ch === '"') {
                                arg = parseString();
                                args.push(arg.value);
                                s += arg.expr;
                            } else if (read("null")) {
                                args.push(null);
                                s += next("null");
                            } else if (read("true")) {
                                args.push(true);
                                s += next("true");
                            } else if (read("false")) {
                                args.push(false);
                                s += next("false");
                            } else if (ch === "-" || ch === "+" || (ch >= "0" && ch <= "9")) {
                                arg = parseNumber();
                                args.push(arg.value);
                                s += arg.expr;
                            } else {
                                exception("invalid filter args");
                            }

                            skipWhitespace();
                            if (ch === ",") {
                                s += next(ch);
                            } else if (ch === "|" || ch === "}") {
                                break;
                            }
                        }
                    }

                    return {
                        expr: s,
                        args: args
                    };
                };
            })(); // getFilterArgsSection()

            return function() {
                var s = "", filters = [], filter, nameSection, argsSection;

                skipWhitespace();

                while (ptr < len) {
                    filter = {};

                    s += next("|");

                    nameSection = getFilterNameSection();
                    s += nameSection.expr;
                    filter.name = nameSection.name;

                    argsSection = getFilterArgsSection();
                    s += argsSection.expr;
                    filter.args = argsSection.args;

                    filters.push(filter);

                    if (read("}}")) {
                        break;
                    } else if (ch !== "|") {
                        exception("syntax error");
                    }
                }

                return {
                    expr:    s,
                    filters: filters
                };
            };
        })(); // getFilterSection()

        return function() {
            var s = "", keySection, filterSection;

            s += next("{{");

            keySection = getKeySection();
            s += keySection.expr;

            filterSection = getFilterSection();
            s += filterSection.expr;

            s += next("}}");

            return {
                type:    "holder",
                expr:    s,
                keys:    keySection.keys,
                filters: filterSection.filters
            };
        };
    })(); // parseHolder()

    that.parse = function(source, content) {
        var result = [];

        src  = source;
        text = content;
        ptr  = 0;
        ch   = content.charAt(0);
        len  = content.length;
        line = 1;
        at   = 1;

//console.log(content);
//console.time("loop");
        while (ptr < len) {
            if (read("{literal}")) {
                result.push(parseLiteral());
            } else if (read("{{")) {
                result.push(parseHolder());
            } else {
                result.push(parseNormal());
            }
        }

//console.timeEnd("loop");
//console.log("");

result.forEach(function(block) {
//    console.log(block.expr.trim());
/*
    if (block.type === "holder") {
        console.log(block.expr);
        console.log("");
        console.log("KEY: " + block.keys.join("."));
        block.filters.forEach(function(filter) {
            console.log("FILTER: ");
            console.log(filter.name);
            console.log(filter.args);
        });
        console.log("");
    }
*/
});
        return result;
    };

    return that;
})();
