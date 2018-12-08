smodules.a = {};

smodules.a.indexOf = (function() {
    var isNative = typeof Array.prototype.indexOf === 'function';

    return function(array, item, fromIdx) {
        if (isNative) {
            return array.indexOf(item, fromIdx);
        } else {
            var i = 0, len = array.length, result = -1;

            if (typeof fromIdx === 'number' && isFinite(fromIdx)) {
                i = Math[fromIdx > 0 ? 'floor' : 'ceil'](fromIdx);

                if (i < 0) {
                    i = Math.max(len + i, 0);
                }
            }

            for ( ; i < len; i++) {
                if (array[i] === item) {
                    result = i;
                    break;
                }
            }

            return result;
        }
    };
})();

smodules.a.lastIndexOf = (function() {
    var isNative = typeof Array.prototype.lastIndexOf === 'function';

    return function(array, item, fromIdx) {
        if (isNative) {
            return array.lastIndexOf(item, fromIdx);
        } else {
            var i = array.length - 1, result = -1;

            if (typeof fromIdx === 'number' && isFinite(fromIdx)) {
                i = Math[fromIdx > 0 ? 'floor' : 'ceil'](fromIdx);

                if (i >= 0) {
                    i = Math.min(array.length - 1, i);
                } else {
                    i = array.length + i;
                }
            }

            for ( ; i >= 0; i--) {
                if (array[i] === item) {
                    result = i;
                    break;
                }
            }

            return result;
        }
    };
})();

smodules.a.forEach = (function() {
    var isNative = typeof Array.prototype.forEach === 'function';

    return function(array, func, context) {
        if (isNative) {
            array.forEach(func, context);
        } else {
            var i = 0, len = array.length;

            for ( ; i < len; i++) {
                func.apply(context, [array[i], i, array]);
            }
        }
    };
})();

smodules.a.filter = (function() {
    var isNative = typeof Array.prototype.filter === 'function';

    return function(array, func, context) {
        if (isNative) {
            return array.filter(func, context);
        } else {
            var i = 0, len = array.length, result = [];

            for ( ; i < len; i++) {
                if (func.apply(context, [array[i], i, array])) {
                    result.push(array[i]);
                }
            }

            return result;
        }
    };
})();

smodules.a.every = (function() {
    var isNative = typeof Array.prototype.every === 'function';

    return function(array, func, context) {
        if (isNative) {
            return array.every(func, context);
        } else {
            var i = 0, len = array.length, result = true;

            for ( ; i < len; i++) {
                if (!func.apply(context, [array[i], i, array])) {
                    result = false;
                    break;
                }
            }

            return result;
        }
    };
})();

smodules.a.some = (function() {
    var isNative = typeof Array.prototype.some === 'function';

    return function(array, func, context) {
        if (isNative) {
            return array.some(func, context);
        } else {
            var i = 0, len = array.length, result = false;

            for ( ; i < len; i++) {
                if (func.apply(context, [array[i], i, array])) {
                    result = true;
                    break;
                }
            }

            return result;
        }
    };
})();

smodules.a.map = (function() {
    var isNative = typeof Array.prototype.map === 'function';

    return function(array, func, context) {
        if (isNative) {
            return array.map(func, context);
        } else {
            var i = 0, len = array.length, result = [];

            for ( ; i < len; i++) {
                result.push(func.apply(context, [array[i], i, array]));
            }

            return result;
        }
    };
})();

smodules.a.reduce = (function() {
    var isNative = typeof Array.prototype.reduce === 'function';

    return function(array, func, memo) {
        var initial = arguments.length > 2;

        if (isNative) {
            return initial ? array.reduce(func, memo) : array.reduce(func);
        } else {
            var i = 0, len = array.length, context;

            if (!initial) {
                if (len === 0) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                memo = array[i];
                i++;
            }

            for ( ; i < len; i++) {
                memo = func.apply(context, [memo, array[i], i, array]);
            }

            return memo;
        }
    };
})();

smodules.a.reduceRight = (function() {
    var isNative = typeof Array.prototype.reduceRight === 'function';

    return function(array, func, memo) {
        var initial = arguments.length > 2;

        if (isNative) {
            return initial ? array.reduceRight(func, memo) : array.reduceRight(func);
        } else {
            var i = array.length - 1, context;

            if (!initial) {
                if (i < 0) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                memo = array[i];
                i--;
            }

            for ( ; i >= 0; i--) {
                memo = func.apply(context, [memo, array[i], i, array]);
            }

            return memo;
        }
    };
})();
