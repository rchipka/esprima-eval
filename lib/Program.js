'use strict';

module.exports = function (self, node, callback) {
  for (var i in node.body) {
    self.walk(node.body[i], function (value) {
      if (value === FAIL) {
        callback(FAIL);
      }

      // if ()
    });
  }
}