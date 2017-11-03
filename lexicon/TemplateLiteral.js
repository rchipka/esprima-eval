'use strict';

module.exports = function (self, node, callback) {
  var str = '',
      expressions = node.expressions,
      length = expressions.length;
      index = 0,
      iterate = function (index, array, cb, done) {
        if (index < length) {
          return cb(expressions[index++], function () {
            iterate(index, array, cb, done);
          });
        }

        return done();
      };

  return iterate(0, quasis, function (quasis, next) {
      self.child(node.type).walk(quasis, function (value) {
        str += value;
        next();
      });
  }, function () {
    iterate(0, expressions, function (expression, next) {
      self.child(node.type).walk(expression, function (value) {
        str += value;
        next();
      });
    }, function () {
      self.child(node.type).walk(node.quasis[length], function (value) {
        str += value;
        callback(str);
      });
    });
  });
}