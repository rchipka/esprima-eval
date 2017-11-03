'use strict';

module.exports = function (self, node, callback) {
  self.child(node.type).walk(node.test, function (val) {
    if (val === FAIL) return callback(FAIL);

    if (val) {
      self.child(node.type + ' TRUE').walk(node.consequent, callback);
    } else {
      self.child(node.type + ' FALSE').walk(node.alternate, callback);
    }
  });
}