'use strict';

module.exports = function (scope, node, callback) {
  var bodies = node.body.body,
      child  = scope.child(),
      params = node.params;

  callback(function () {
    var args = new Array(arguments.length);

    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    child.set('arguments', args, function () {
      child.iterate(args.length, function (i, next) {
        var param = params[i];

        if (param.type === 'Identifier') {
          child.set(param.id.name, args[i]);
        } else {
          child.walk(param, next);
        }
      }, function () {
        scope.iterate(bodies.length, function (i, next) {
          child.walk(bodies[i], next);
        }, callback);
      });
    });
  });
}