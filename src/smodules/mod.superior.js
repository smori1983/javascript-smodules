smodules.mod.superior = function(module, name) {
    var method = module[name];

    return function() {
        return method.apply(module, arguments);
    };
};
