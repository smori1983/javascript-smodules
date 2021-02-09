const superior = function(module, name) {
  const method = module[name];

  return function() {
    return method.apply(module, arguments);
  };
};

module.exports.init = function (module, name) {
  return superior(module, name);
};
