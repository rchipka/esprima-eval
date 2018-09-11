'use strict';

module.exports = function (scope, node, callback) {
  return scope.iterate(node.quasis.length, function (i, next, done, string) {
    var quasis = node.quasis[i],
        expression = null;

      if (quasis.tail === false) {
        expression = node.expressions[i];
      }

      return scope.tryWalk(quasis, function (qValue) {
        return scope.tryWalk(expression, function (eValue) {
          next(string += qValue + eValue);
        }, '');
      }, '');
  }, function (value) {
    return callback(value);
  }, '');
}