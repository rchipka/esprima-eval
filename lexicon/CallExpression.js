'use strict';

module.exports = function (scope, node, callback) {
  var ret;

  scope.walk(node.callee, function (callee) {
    if (typeof callee !== 'function') {
      scope.error(node, JSON.stringify(callee) + ' is not a function', callback);
      return;
    }

    var args = new Array(node.arguments.length);

    scope.iterate(node.arguments.length, function (index, next) {
      scope.walk(node.arguments[index], function (value) {
        next(args[index] = value);
      });
    }, function () {
      if (callee.hasOwnProperty('__internal__')) {
        ret = callee.__internal__(args, callback);
        return;
      }

      callback(ret = callee.apply(null, args));
    });
  });

  return ret;
}