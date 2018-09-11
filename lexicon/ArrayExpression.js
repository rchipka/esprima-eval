'use strict';

module.exports = function ArrayExpression(scope, node, callback) {
  var elements = node.elements;

  return scope.iterate(elements.length, function (index, next, done, array) {
      return scope.walk(elements[index], function (value) {
        array[index] = value;

        return next(array);
      });
    }, callback, Array(elements.length));
}