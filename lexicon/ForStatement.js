'use strict';

module.exports = function (scope, node, callback) {
  var iterate = function (done) {
    scope.walk(node.test, function (value) {
      if (value == false) {
        return done();
      }

      scope.walk(node.body, function () {
        scope.walk(node.update, function () {
          iterate(done);
        });
      });
    });
  };

  scope.walk(node.init, function () {
    iterate(callback);
  });
}