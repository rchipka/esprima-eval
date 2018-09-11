'use strict';

module.exports = function CallExpression(scope, node, callback) {
  var args = new Array(node.arguments.length);

  return scope.iterate(node.arguments.length, function (index, next) {
    return scope.walk(node.arguments[index], function (value) {
      return next(args[index] = value);
    });
  }, function () {
    return scope.walk(node.callee, function (callee, object, prop) {
      var context = object;

      if (object instanceof scope.Scope) {
        context = object.global;
      }

      return scope.call(node, callee, context, args, callback);
    });
  });
}