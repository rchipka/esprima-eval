'use strict';

function retValue(val) {
  return val;
}

module.exports = function InternalFunction(scope, params, body, callback) {
  var func = function () {
    var length = arguments.length,
        args = new Array(length),
        i = 0;

    for (; i < length; i++) {
      args[i] = arguments[i];
    }

    return func.__internal__(this, args, retValue);
  };

  func.__scope__ = scope;
  func.__internal__ = function (context, args, callback) {
    return scope.childFunction(context, args, function (child) {
      return child.assign('this', context, function () {
        return child.assign('arguments', args, function () {
          return child.iterate(Math.min(params.length, args.length), function (i, next) {
            var param = params[i];

            if (param.type === 'Identifier') {
              return child.assign(param.name, args[i], next);
            }
            
            return child.walk(param, next);
          }, function () {
            return child.walkArray(body, callback);
          });
        });
      });
    });
  };

  return callback(func);
};