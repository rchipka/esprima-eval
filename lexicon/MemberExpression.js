'use strict';

module.exports = function MemberExpression(scope, node, callback) {
  return scope.walk(node.object, function (object) {
    if (node.computed === false) {
      var prop = node.property.name;

      return scope.getProperty(node, object, prop, callback);
    }

    return scope.walk(node.property, function (prop) {
      return scope.getProperty(node, object, prop, callback);
    });
  });
}