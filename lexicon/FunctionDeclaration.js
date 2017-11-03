'use strict';

var FunctionObject = require('../lib/FunctionObject.js');

module.exports = function (scope, node, callback) {
  var body = node.body,
      name = node.id.name,
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
          child.set(param.id.name, args[i]);
        } else {
          child.walk(param, next);
        }
      }, function () {
        child.walk(body, function (value) {
          callback(ret = value);
        });
      });
    });

    return ret;
  }

  scope.set(name, func, callback);
}