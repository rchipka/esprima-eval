'use strict';

module.exports = function (scope, node, callback) {
  scope.child(node.type).walk(node.left, function (l) {
    scope.child(node.type).walk(node.right, function (r) {
      var op = node.operator;
      if (op === '==') return callback(l == r);
      if (op === '===') return callback(l === r);
      if (op === '!=') return callback(l != r);
      if (op === '!==') return callback(l !== r);
      if (op === '+') return callback(l + r);
      if (op === '-') return callback(l - r);
      if (op === '*') return callback(l * r);
      if (op === '/') return callback(l / r);
      if (op === '%') return callback(l % r);
      if (op === '<') return callback(l < r);
      if (op === '<=') return callback(l <= r);
      if (op === '>') return callback(l > r);
      if (op === '>=') return callback(l >= r);
      if (op === '|') return callback(l | r);
      if (op === '&') return callback(l & r);
      if (op === '^') return callback(l ^ r);
      if (op === '&&') return callback(l && r);
      if (op === '||') return callback(l || r);
      
      return scope.fail(callback);
    });
  });

  return;
}