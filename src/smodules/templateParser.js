smodules.templateParser = function() {
    var that = {},
        src,
        text,
        ptr,
        ch,
        len,
        line,
        at;

    var exception = function(message) {
        throw new Error("smodules.templateParser - " + message + " in source " + src + " [" + line + "," + at + "]");
    };

    var next = (function(expr, replace) {
        var position = function(expr) {
            while (expr.length > 0) {
                if (expr.slice(0, 1) === "\n") {
                    line++;
                    at = 1;
                } else {
                    at++;
                }
                expr = expr.slice(1);
            }
        };

        return function(expr, replace) {
            expr = expr || ch;

            if (text.indexOf(expr, ptr) !== ptr) {
                exception("syntax error");
            }

            position(expr);

            ptr += expr.length;
            ch = text.charAt(ptr);

            return replace || expr;
        };
    })();

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

    var readRegex = function(regex) {
        return regex.test(text.slice(ptr));
    };

    var readLeftTag = function() {
        return readRegex(/^\{\s*left\s*\}/);
    };

    var eatLeftTag = function() {
        next("{");
        skipWhitespace();
        next("left");
        skipWhitespace();
        next("}");

        return "{";
    };

    var readRightTag = function() {
        return readRegex(/^\{\s*right\s*\}/);
    };

    var eatRightTag = function() {
        next("{");
        skipWhitespace();
        next("right");
        skipWhitespace();
        next("}");

        return "}";
    };

    var readLiteralTag = function() {
        return readRegex(/^\{\s*literal\s*\}/);
    };

    var eatLiteralTag = function() {
        next("{");
        skipWhitespace();
        next("literal");
        skipWhitespace();
        next("}");

        return "{literal}";
    };

    var readEndLiteralTag = function() {
        return readRegex(/^\{\s*\/\s*literal\s*\}/);
    };

    var eatEndLiteralTag = function() {
        next("{");
        skipWhitespace();
        next("/");
        skipWhitespace();
        next("literal");
        skipWhitespace();
        next("}");

        return "{/literal}";
    };

    var readIfTag = function() {
        return readRegex(/^\{\s*if\s/);
    };

    var eatIfTag = function() {
        next("{");
        skipWhitespace();
        next("if");
        skipWhitespace();

        return "{if ";
    };

    var readElseifTag = function() {
        return readRegex(/^\{\s*elseif\s/);
    };

    var eatElseifTag = function() {
        next("{");
        skipWhitespace();
        next("elseif");
        skipWhitespace();

        return "{elseif ";
    };

    var readElseTag = function() {
        return readRegex(/^\{\s*else\s*\}/);
    };

    var eatElseTag = function() {
        next("{");
        skipWhitespace();
        next("else");
        skipWhitespace();
        next("}");

        return "{else}";
    };

    // NOTE: currently not used.
    var readEndIfTag = function() {
        return readRegex(/^\{\s*\/\s*if\s*\}/);
    };

    var eatEndIfTag = function() {
        next("{");
        skipWhitespace();
        next("/");
        skipWhitespace();
        next("if");
        skipWhitespace();
        next("}");

        return "{/if}";
    };

    var readForTag = function() {
        return readRegex(/^\{\s*for\s/);
    };

    var eatForTag = function() {
        next("{");
        skipWhitespace();
        next("for");
        skipWhitespace();

        return "{for ";
    };

    var readEndForTag = function() {
        return readRegex(/^\{\s*\/\s*for\s*\}/);
    };

    var eatEndForTag = function() {
        next("{");
        skipWhitespace();
        next("/");
        skipWhitespace();
        next("for");
        skipWhitespace();
        next("}");

        return "{/for}";
    };

    var readHolderTag = function() {
        return readRegex(/^\{\s*\$/);
    };

    // NOTE: currently not used.
    var readTmpVar = function() {
        return readRegex(/^\$\w+[^\w]/);
    };

    var eatTmpVar = function() {
        var s = next("$");

        while (/\w/.test(ch)) {
            s += next(ch);
        }

        if (s === "$") {
            exception("tmp variable not found");
        }

        return s.slice(1);
    };

    var readVar = function() {
        return readRegex(/^\$\w+(?:\.\w+)*(?:[^\w]|$)/);
    };

    var parseVar = function() {
        var s = next("$");

        while (/[\w\.]/.test(ch)) {
            s += next(ch);
        }

        if (s === "$") {
            exception("variable not found");
        } else if (/^\$\.|\.$|\.\./.test(s)) {
            exception("invalid variable expression");
        }

        return {
            type: "var",
            expr: s,
            keys: s.slice(1).split("."),
        };
    };

    var readNull = function() {
        return readRegex(/^null[^\w]/);
    };

    var parseNull = function() {
        return {
            type:  "value",
            expr:  next("null"),
            value: null,
        };
    };

    var readTrue = function() {
        return readRegex(/^true[^\w]/);
    };

    var parseTrue = function() {
        return {
            type:  "value",
            expr:  next("true"),
            value: true,
        };
    };

    var readFalse = function() {
        return readRegex(/^false[^\w]/);
    };

    var parseFalse = function() {
        return {
            type:  "value",
            expr:  next("false"),
            value: false,
        };
    };

    var readString = function() {
        return ch === "'" || ch === '"';
    };

    var parseString = function() {
        var matched;

        if ((matched = text.slice(ptr).match(/^(["'])(?:\\\1|\s|\S)*?\1/))) {
            next(matched[0]);

            return {
                type:  "value",
                expr:  matched[0],
                value: matched[0].slice(1, -1).replace("\\" + matched[1], matched[1]),
            };
        } else {
            exception("string expression not closed");
        }
    };

    var readNumber = function() {
        return ch === "+" || ch === "-" || (ch >= "0" && ch <= "9");
    };

    var parseNumber = function() {
        var value, matched = text.slice(ptr).match(/^[\+\-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][\+\-]?\d+)?/);

        if (matched && !isNaN(value = +(matched[0]))) {
            next(matched[0]);

            return {
                type:  "value",
                expr:  matched[0],
                value: value,
            };
        } else {
            exception("invalid number expression");
        }
    };

    var readValue = function() {
        return readNull() || readTrue() || readFalse() || readString() || readNumber();
    };

    var parseValue = function() {
        if (readNull()) {
            return parseNull();
        } else if (readTrue()) {
            return parseTrue();
        } else if (readFalse()) {
            return parseFalse();
        } else if (readString()) {
            return parseString();
        } else if (readNumber()) {
            return parseNumber();
        } else {
            exception("value shoud be written");
        }
    };

    var readAndOr = function() {
        return readRegex(/^(and|or)[^\w]/);
    };

    var parseAndOr = function() {
        var expr;

        if (read("and")) {
            expr = next("and");
        } else if (read("or")) {
            expr = next("or");
        } else {
            exception("'and' or 'or' should be written");
        }

        return {
            type: "andor",
            expr: expr,
        };
    };

    var compRegex = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;

    var readComp = function() {
        return readRegex(compRegex);
    };

    var parseComp = function() {
        var matched, expr;

        if ((matched = text.slice(ptr).match(compRegex))) {
            expr = next(matched[0]);
        } else {
            exception("comparer should be written");
        }

        return {
            type: "comp",
            expr: expr,
        };
    };

    var readRoundBracket = function() {
        return ch === "(";
    };

    var parseRoundBracket = function() {
        return {
            type: "roundBracket",
            expr: next("("),
        };
    };

    var readEndRoundBracket = function() {
        return ch === ")";
    };

    var parseEndRoundBracket = function() {
        return {
            type: "endRoundBracket",
            expr: next(")"),
        };
    };

    var parseCondition = (function() {
        var getReversePolish = (function() {
            /* eslint-disable array-bracket-spacing */
            var state = {
                "start":           ["roundBracket",                    "value", "var",                  "error"],
                "roundBracket":    ["roundBracket",                    "value", "var",                  "error"],
                "endRoundBracket": [                "endRoundBracket",                         "andor", "error"],
                "value":           [                "endRoundBracket",                 "comp", "andor", "error"],
                "var":             [                "endRoundBracket",                 "comp", "andor", "error"],
                "comp":            [                                   "value", "var",                  "error"],
                "andor":           ["roundBracket",                    "value", "var",                  "error"],
            };
            /* eslint-enable */

            var method = {
                "roundBracket":    { read: readRoundBracket,    parse: parseRoundBracket },
                "endRoundBracket": { read: readEndRoundBracket, parse: parseEndRoundBracket },
                "value":           { read: readValue,           parse: parseValue },
                "var":             { read: readVar,             parse: parseVar },
                "comp":            { read: readComp,            parse: parseComp },
                "andor":           { read: readAndOr,           parse: parseAndOr },
            };

            var history = (function() {
                var stack;

                return {
                    init: function() {
                        stack = ["start"];
                    },
                    add: function(type) {
                        stack.push(type);
                    },
                    get: function(idx) {
                        return stack[stack.length - idx] || null;
                    },
                };
            })();

            var sectionTypeStat = (function() {
                var roundBracketBalance, operandOperatorBalance;

                return {
                    init: function() {
                        roundBracketBalance    = 0;
                        operandOperatorBalance = 0;
                    },
                    add: function(type) {
                        if (type === "var" || type === "value") {
                            operandOperatorBalance++;
                        } else if (type === "comp" || type === "andor") {
                            operandOperatorBalance--;
                        } else if (type === "roundBracket") {
                            roundBracketBalance++;
                        } else if (type === "endRoundBracket") {
                            roundBracketBalance--;
                        }

                        if (roundBracketBalance < 0) {
                            exception("can not use ')' here");
                        }
                    },
                    finish: function() {
                        if (roundBracketBalance !== 0) {
                            exception("invalid usage of round bracket");
                        }
                        if (operandOperatorBalance !== 1) {
                            exception("invalid usage of operand or operator");
                        }
                    },
                };
            })();

            var getOrder = (function() {
                var orders = {
                    "endRoundBracket": 1,
                    "or":              2,
                    "and":             3,
                    "comp":            4,
                    "value":           5,
                    "var":             5,
                    "roundBracket":    6,
                };

                return function(section) {
                    return orders[section.type] || orders[section.expr];
                };
            })();

            var parse = function() {
                var list = state[history.get(1)], i = 0, size = list.length, type, result;

                for ( ; i < size; i++) {
                    type = list[i];

                    if (type === "error") {
                        exception("invalid condition expression");
                    } else if (method[type].read()) {
                        if (type === "comp" && history.get(2) === "comp") {
                            exception("can not write comparer here");
                        }
                        result = method[type].parse();
                        break;
                    }
                }
                history.add(result.type);
                sectionTypeStat.add(result.type);

                return result;
            };

            return function() {
                var section, polish = [], stack = [], stackTop;

                history.init();
                sectionTypeStat.init();
                while (ptr < len) {
                    if (ch === "}") {
                        break;
                    } else {
                        section = parse();
                        section.order = getOrder(section);
                    }

                    while (stack.length > 0) {
                        stackTop = stack.pop();

                        if (section.order <= stackTop.order && stackTop.type !== "roundBracket") {
                            polish.push(stackTop);
                        } else {
                            stack.push(stackTop);
                            break;
                        }
                    }

                    if (section.type === "endRoundBracket") {
                        stack.pop();
                    } else {
                        stack.push(section);
                    }

                    skipWhitespace();
                }

                while (stack.length > 0) {
                    polish.push(stack.pop());
                }
                sectionTypeStat.finish();

                return polish;
            };
        })(); // getReversePolish()

        return function() {
            var type, stack = null;

            if (readIfTag()) {
                eatIfTag();
                type = "if";
            } else if (readElseifTag()) {
                eatElseifTag();
                type = "elseif";
            } else if (readElseTag()) {
                eatElseTag();
                type = "else";
            } else {
                exception("unknown condition expression");
            }

            if (type === "if" || type === "elseif") {
                stack = getReversePolish();
                next("}");
            }

            return {
                type:  type,
                stack: stack,
            };
        };
    })(); // parseCondition()

    var parseNormalBlock = function() {
        var s = "";

        while (ptr < len) {
            if (ch === "{") {
                if (readLeftTag()) {
                    s += eatLeftTag();
                } else if (readRightTag()) {
                    s += eatRightTag();
                } else {
                    break;
                }
            } else if (ch === "}") {
                exception("syntax error");
            } else {
                s += next(ch);
            }
        }

        return {
            type: "normal",
            expr: s,
        };
    };

    var parseLiteralBlock = function() {
        var s = "", closed = false, startLine = line, startAt = at;

        eatLiteralTag();

        while (ptr < len) {
            if (ch === "{") {
                if (readLeftTag()) {
                    s += eatLeftTag();
                } else if (readRightTag()) {
                    s += eatRightTag();
                } else if (readEndLiteralTag()) {
                    eatEndLiteralTag();
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
            exception("literal block starts at [" + startLine + ", " + startAt + "] not closed by {/literal}");
        }

        return {
            type: "literal",
            expr: s,
        };
    };

    var parseHolderBlock = (function() {
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
                    expr: s,
                    name: s,
                };
            };

            var getFilterArgsSection = function() {
                var s = "", args = [], arg;

                skipWhitespace();

                if (ch === ":") {
                    s += next(":");

                    while (ptr < len) {
                        skipWhitespace();

                        if (ch === "n") {
                            arg = parseNull();
                        } else if (ch === "t") {
                            arg = parseTrue();
                        } else if (ch === "f") {
                            arg = parseFalse();
                        } else if (ch === "'" || ch === '"') {
                            arg = parseString();
                        } else if (ch === "-" || ch === "+" || (ch >= "0" && ch <= "9")) {
                            arg = parseNumber();
                        } else {
                            exception("invalid filter args");
                        }

                        s += arg.expr;
                        args.push(arg.value);

                        skipWhitespace();

                        if (ch === ",") {
                            s += next(",");
                        } else if (ch === "|" || ch === "}") {
                            break;
                        }
                    }
                }

                return {
                    expr: s,
                    args: args,
                };
            }; // getFilterArgsSection()

            var mainLoop = function() {
                var s = "", filters = [], filter, nameSection, argsSection;

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

                    if (ch === "}") {
                        break;
                    } else if (ch !== "|") {
                        exception("syntax error");
                    }
                }

                return {
                    expr:    s,
                    filters: filters,
                };
            };

            return function() {
                var s = "", filters = [], mainResult;

                skipWhitespace();

                if (ch === "|") {
                    mainResult = mainLoop();

                    s       = mainResult.expr;
                    filters = mainResult.filters;
                }

                return {
                    expr:    s,
                    filters: filters,
                };
            };
        })(); // getFilterSection()

        return function() {
            var s = "", keySection, filterSection;

            s += next("{");

            skipWhitespace();

            keySection = parseVar();
            s += keySection.expr;

            filterSection = getFilterSection();
            s += filterSection.expr;

            s += next("}");

            return {
                type:    "holder",
                expr:    s,
                keys:    keySection.keys,
                filters: filterSection.filters,
            };
        };
    })(); // parseHolderBlock()

    var parseForBlock = (function() {
        var parseHeader = function() {
            var s = eatForTag(), k, v, array;

            v = eatTmpVar();
            s += v;
            skipWhitespace();

            if (ch === ",") {
                k = v;
                s += next(",");

                skipWhitespace();
                v = eatTmpVar();
                s += v;
                skipWhitespace();
            }

            s += " ";
            if (!readRegex(/^in\s/)) {
                exception("invalid for expression");
            }
            s += next("in");
            skipWhitespace();

            array = parseVar();
            s += array.expr;
            skipWhitespace();

            s += next("}");

            return {
                expr:  s,
                k:     k,
                v:     v,
                array: array.keys,
            };
        }; // parseHeader()

        return function() {
            var header = parseHeader(),
                blocks = loop([], true);

            eatEndForTag();

            return {
                type:   "for",
                header: header,
                blocks: blocks,
            };
        };
    })(); // parseForBlock()

    var parseIfBlock = function() {
        var sections = [];

        while (readIfTag() || readElseifTag() || readElseTag()) {
            sections.push({
                header: parseCondition(),
                blocks: loop([], true),
            });
        }
        eatEndIfTag();

        return {
            type:     "if",
            sections: sections,
        };
    }; // parseIfBlock()

    var loop = function(result, inBlock) {
        while (ptr < len) {
            if (ch === "{") {
                if (inBlock && (readElseifTag() || readElseTag() || readEndIfTag() || readEndForTag())) {
                    break;
                } else if (readLiteralTag()) {
                    result.push(parseLiteralBlock());
                } else if (readIfTag()) {
                    result.push(parseIfBlock());
                } else if (readForTag()) {
                    result.push(parseForBlock());
                } else if (readHolderTag()) {
                    result.push(parseHolderBlock());
                } else {
                    exception("unknown tag");
                }
            } else {
                result.push(parseNormalBlock());
            }
        }

        return result;
    };


    that.parse = function(content, source) {
        src  = source || "";
        text = content;
        ptr  = 0;
        ch   = content.charAt(0);
        len  = content.length;
        line = 1;
        at   = 1;

        return loop([]);
    };

    return that;
};
