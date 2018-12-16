smodules.ui.hasId = function(event, id, callbackTrue, callbackFalse) {
  var target = event.target;

  if ($(target).attr('id') === id) {
    callbackTrue(target);
  } else if (typeof callbackFalse === 'function') {
    callbackFalse(target);
  }
};
