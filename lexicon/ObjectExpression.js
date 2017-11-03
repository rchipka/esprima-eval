'use strict';

module.exports = function (scope, node, callback) {
  var properties = node.properties,
      length = properties.length,
      count  = 0,
      object = {};

  if (length < 1) {
    return callback(object);
  }

  scope.iterate(length, function (index, next) {
    var prop = properties[index];

    scope.walk(prop.value, function (value) {
      object[prop.key.name] = value;

      next(object);
    });
  }, callback);
}