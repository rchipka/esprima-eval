'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.test, function (value) {
    if (value) {
      scope.walk(node.consequent, callback);
      return;
    }

    if (node.alternate !== null) {
      scope.walk(node.alternate, callback);
    }
  });
}