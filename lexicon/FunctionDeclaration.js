'use strict';

module.exports = function (scope, node, callback) {
  var bodies = node.body.body,
      name   = node.id.name,
      child  = scope.child(),
      bnode;
  
  if (bodies.length === 0) {
    scope.set(name, function (node) {
      console.log('called', name);
    });

    return callback();
  }

  scope.iterate(bodies.length, function (i, next) {
    bnode = bodies[i];

    child.walk(bnode, next);
  }, callback);

  return;
}