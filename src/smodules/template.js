smodules.template = (function() {
    var loadedTemplateFiles = {};

    var escapeHTML = (function() {
        var list = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return function(value) {
            return value.toString().replace(/[<>&"']g/, function(matched) {
                return list[matched];
            });
        };
    })();

    var regexQuote = function(str) {
        return str.replace(/[\*\+\?\.\-\[\]\{\}\\\/]/g, function(matched) {
            return "\\" + matched;
        });
    };

    var delimL = regexQuote("{{");
    var delimR = regexQuote("}}");

    var isRemoteFile = function(templateSrc) {
        return templateSrc.match(/\.html$/);
    };

    var execute = function(templateSrc, bindParams, callback) {
        if (loadedTemplateFiles.hasOwnProperty(templateSrc)) {
            executeRecursive(loadedTemplateFiles[templateSrc], bindParams, callback);
        } else {
            if (isRemoteFile(templateSrc)) {
                $.ajax({
                    url: templateSrc,
                    success: function(response) {
                        loadedTemplateFiles[templateSrc] = response;
                        executeRecursive(response, bindParams, callback);
                    }
                });
            } else {
                executeRecursive(templateSrc, bindParams, callback);
            }
        }
    };

    var executeRecursive = function(templateSrc, bindParams, callback) {
        if (!$.isArray(bindParams)) {
            bindParams = [bindParams];
        }

        $.each(bindParams, function(idx, params) {
            callback(bind(templateSrc, params));
        });
    };

    var bind = function(templateSrc, bindParams) {
        var ret = templateSrc;

        $.each(bindParams, function(key, value) {
            if (typeof value === "object") {
                ret = bindObject(ret, key, value);
            } else {
                ret = bindValue(ret, key, value);
            }
        });

        return ret;
    };

    var bindObject = function(templateSrc, key, value) {
        var ret = templateSrc;
        var regex = new RegExp(delimL + "\\s*(" + regexQuote(key) + "[^\\s" + delimR + "]*)\\s*" + delimR, "g");

        $.each(templateSrc.match(regex), function(idx, matched) {
            var regex = new RegExp("^" + delimL + "\\s*|\\s*" + delimR + "$", "g");
            var ob = matched.replace(regex, "").split(".").slice(1);
            var chain = value;

            while (ob.length > 0) {
                chain = chain[ob.shift()];
            }
            ret = ret.replace(matched, escapeHTML(chain));
        });

        return ret;
    };

    var bindValue = function(templateSrc, key, value) {
        var regex = new RegExp(delimL + "\\s*" + regexQuote(key) + "\\s*" + delimR, "g");

        return templateSrc.replace(regex, escapeHTML(value));
    };

    var ret = function(templateFile, bindParams) {
        return {
/*
            display: function() {
                execute(templateFile, bindParams, function(response) {
                    document.write(response);
                });
            },
*/
            appendTo: function(target) {
                execute(templateFile, bindParams, function(response) {
                    $(response).appendTo(target);
                });
            },
            insertBefore: function(target) {
                execute(templateFile, bindParams, function(response) {
                    $(response).insertBefore(target);
                });
            }
        };
    };

    ret.setDelimiter = function(left, right) {
        delimL = regexQuote(left);
        delimR = regexQuote(right);
    };

    return ret;
})();
