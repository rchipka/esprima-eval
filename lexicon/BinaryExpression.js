'use strict';

var ops = {
  '==': function (l, r, callback) {
    return callback(l == r);
  },
  '===': function (l, r, callback) {
    return callback(l === r);
  },
  '!=': function (l, r, callback) {
    return callback(l != r);
  },
  '!==': function (l, r, callback) {
    return callback(l !== r);
  },
  '+': function (l, r, callback) {
    return callback(l + r);
  },
  '-': function (l, r, callback) {
    return callback(l - r);
  },
  '*': function (l, r, callback) {
    return callback(l * r);
  },
  '/': function (l, r, callback) {
    return callback(l / r);
  },
  '%': function (l, r, callback) {
    return callback(l % r);
  },
  '<': function (l, r, callback) {
    return callback(l < r);
  },
  '>': function (l, r, callback) {
    return callback(l > r);
  },
  '>=': function (l, r, callback) {
    return callback(l >= r);
  },
  '<=': function (l, r, callback) {
    return callback(l <= r);
  },
  '|': function (l, r, callback) {
    return callback(l | r);
  },
  '&': function (l, r, callback) {
    return callback(l & r);
  },
  '^': function (l, r, callback) {
    return callback(l ^ r);
  },
  '&&': function (l, r, callback) {
    return callback(l && r);
  },
  '||': function (l, r, callback) {
    return callback(l || r);
  },
  'instanceof': function (l, r, callback, scope) {
    if (l instanceof Function && r === scope.global.data.Function) {
      return callback(true);
    }
    
    return callback(l instanceof r);
  }
};

module.exports = function (scope, node, callback) {
  scope.child(node.type).walk(node.left, function (l) {
    scope.child(node.type).walk(node.right, function (r) {
      return ops[node.operator](l, r, callback, scope);
    });
  });
}