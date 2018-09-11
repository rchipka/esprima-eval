'use strict';

module.exports = function (scope, node, callback) {
  return scope.walk(node.test, function (value) {
    console.log('if', value);
    if (value) {
      return scope.tryWalk(node.consequent, callback);
    }

    return scope.tryWalk(node.alternate, callback);
  });
}