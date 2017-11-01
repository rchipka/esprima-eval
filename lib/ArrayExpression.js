'use strict';

module.exports = function (self, node, callback) {
  var length = node.elements.length,
      array = Array(length);

  if (length < 1) {
    return callback(array);
  }

  var push = function (value) {
    if (array.push(value) === length) {
      callback(array);
    }
  }

  for (var i = 0, l = length; i < l; i++) {
    self.child(node.elements[i].type).walk(node.elements[i], function (value) {
      if (x === FAIL) return callback(FAIL);
      push(value);
    });
  }

  return;
}