'use strict';

module.exports = function (scope, node, callback) {
  var body = node.body.body,
      params = node.params,
      func = function () {
        var length = arguments.length,
            args = new Array(length),
            i = 0;

        for (; i < length; i++) {
          args[i] = arguments[i];
        }

        return func.__internal__(args, function () {});
      };

  func.__internal__ = function (args, callback) {
    var child = scope.child(),
        ret;

    child.set('arguments', args, function () {
      child.iterate(args.length, function (i, next) {
        var param = params[i];

        if (param.type === 'Identifier') {
          child.set(param.name, args[i], next);
        } else {
          child.walk(param, next);
        }
      }, function () {
        scope.iterate(body.length, function (i, next) {
          child.walk(body[i], next);
        }, function (value) {
          callback(ret = value);
        });
      });
    });

    return ret;
  }

  callback(func);

  return func;
}