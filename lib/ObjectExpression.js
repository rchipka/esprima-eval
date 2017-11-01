'use strict';

module.exports = function (self, node, callback) {
  var length = node.properties.length,
      count  = 0,
      object = {};

  if (length < 1) {
    return callback(array);
  }

  var set = function (key, value) {
    object[key] = value;

    if (++count === length) {
      callback(array);
    }
  }

  for (var i = 0, l = length; i < l; i++) {
    var prop = node.properties[i];

    self.child(node.properties[i].type).walk(node.properties[i], function (value) {
      if (x === FAIL) return callback(FAIL);
      set(prop, value);
    });
  }

  return;
}