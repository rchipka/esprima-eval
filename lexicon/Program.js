'use strict';

module.exports = function (scope, node, callback) {
  var array = node.body;

  scope.iterate(array.length, function (index, next) {
    scope.walk(array[index], next);
  }, callback);
}