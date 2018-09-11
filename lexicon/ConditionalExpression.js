'use strict';

module.exports = function (scope, node, callback) {
  return scope.walk(node.test, function (val) {
    if (val) {
      return scope.walk(node.consequent, callback);
    }

    return scope.walk(node.alternate, callback);
  });
}