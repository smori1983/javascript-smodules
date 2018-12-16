smodules.ui.hasClass = function(event, className, callbackTrue, callbackFalse) {
  var target = event.target;

  if ($(target).hasClass(className)) {
    callbackTrue(target);
  } else if (typeof callbackFalse === 'function') {
    callbackFalse(target);
  }
};
