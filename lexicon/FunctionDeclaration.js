'use strict';

module.exports = function (scope, node, callback) {
  var bodies = node.body.body,
      name   = node.id.name,
      child  = scope.child();
  
    scope.set(name, function (node) {
      child.walkArray(bodies, callback);
    }, callback);
}