'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.left, function (left, object, prop) {
    var setScope = scope;

    if (typeof left === 'undefined' && typeof prop !== 'string') {
      if (node.left.type === 'Identifier') {
        // TODO: shouldn't set in strict mode
        setScope = scope.global;
      } else {
        scope.error(node, 'Left-hand assignment undefined', callback);
        return;
      }
    }

    scope.walk(node.right, function (right) {
      if (typeof prop === 'string') {
        callback(object[prop] = right);
        return;
      }

      setScope.set(node.left.name, right, callback);
    });
  });
}