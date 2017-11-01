'use strict';

module.exports = function (self, node, callback) {
  var val = self.child(node.type).walk(node.expression)
  if (val === FAIL) return FAIL;
  return val;
}