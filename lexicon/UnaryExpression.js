'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.argument, function (value) {
    if (node.operator === '+') return callback(+val);
    if (node.operator === '-') return callback(-val);
    if (node.operator === '~') return callback(~val);
    if (node.operator === '!') return callback(!val);

    return callback(scope.FAIL);
  });
}