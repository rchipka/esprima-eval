'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.argument, function (value) {
    if (node.operator === '+') return callback(+value);
    if (node.operator === '-') return callback(-value);
    if (node.operator === '~') return callback(~value);
    if (node.operator === '!') return callback(!value);

    return scope.fail(callback);
  });
}