'use strict';

module.exports = function (scope, node, callback) {
  var ret;

  scope.walk(node.callee, function (callee) {
    // console.log("CALLEE:", callee);
    if (callee === scope.FAIL) {
      callback(scope.FAIL);
      return;
    }

    var args = new Array(node.arguments.length);

    scope.iterate(node.arguments.length, function (index, next) {
      scope.walk(node.arguments[index], function (value) {
        next(args[index] = value);
      });
    }, function () {
      if (typeof callee === 'function') {
        ret = callback(callee.apply(null, args));
        return;
      }

      var child = scope.child();
      var params = callee.params;    

      child.set('arguments', args, function () {
        child.iterate(args.length, function (i, next) {
          var param = params[i];

          if (param.type === 'Identifier') {
            child.set(param.id.name, args[i]);
          } else {
            child.walk(param, next);
          }
        }, function () {
          var bodies = callee.body.body;

          scope.iterate(bodies.length, function (i, next) {
            child.walk(bodies[i], next);
          }, function (value) {
            callback(value);
            ret = value;
          });
        });
      });
    });
  });

  return ret;
}