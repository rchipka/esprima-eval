'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.argument, function (value, object, prop) {
    if (typeof prop === 'undefined') {
      return scope.error(node, 'No prop', callback);
    }

    // TODO: handle `prefix: true`

    if (node.operator === '++') {
      value++;
    } else if (node.operator === '--') {
      value--;
    }

    callback(object[prop] = value);
  });
}