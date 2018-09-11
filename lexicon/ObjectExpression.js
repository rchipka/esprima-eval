'use strict';

module.exports = function ObjectExpression(scope, node, callback) {
  var properties = node.properties,
      length = properties.length,
      count  = 0,
      object = {};

  if (length < 1) {
    return callback(object);
  }

 return  scope.iterate(length, function (index, next) {
    var prop = properties[index];

    return scope.walk(prop.value, function (value) {
      object[prop.key.name] = value;

      return next(object);
    });
  }, callback);
}