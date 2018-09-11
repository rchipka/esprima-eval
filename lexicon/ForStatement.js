'use strict';

module.exports = function ForStatement(scope, node, callback) {
  return scope.tryWalk(node.init, function () {
    return scope.iterate(Infinity, function (index, next, done) {
      return scope.tryWalk(node.test, function (result) {
        if (!result) {
          return done(result);
        }

        return scope.tryWalk(node.body, function () {
          return scope.tryWalk(node.update, next);
        });
      });
    }, callback);
  });
}