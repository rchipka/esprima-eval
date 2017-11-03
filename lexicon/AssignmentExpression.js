'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.left, function (left) {
    var setScope = scope;

    if (typeof left === 'undefined') {
      if (node.left.type === 'Identifier') {
        // TODO: shouldn't set in strict mode
        setScope = scope.fs;
      } else {
        callback(scope.FAIL);
      }
    }

    scope.walk(node.right, function (right) {
      if (right === scope.FAIL) {
        callback(scope.FAIL);
        return;
      }

      setScope.set(node.left.name, right, callback);
    });
  });
}