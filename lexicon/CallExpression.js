'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.callee, function (callee) {
    if (callee === scope.FAIL || typeof callee !== 'function') {
      callback(scope.FAIL);
      return;
    }

    var args = new Array(node.arguments.length);

    scope.iterate(node.arguments.length, function (index, next) {
      scope.walk(node.arguments[index], function (value) {
        next(args[index] = value);
      });
    }, function () {
      callback(callee.apply(null, args));
    });
  });
}