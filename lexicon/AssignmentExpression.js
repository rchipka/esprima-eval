'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.right, function (right) {
    if (right === scope.FAIL) {
      callback(scope.FAIL);
      return;
    }

    scope.set(node.left.name, right, callback);
  });
}