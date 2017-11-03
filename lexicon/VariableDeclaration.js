'use strict';

var util = require('util');

module.exports = function (scope, node, callback) {
  var variableScope = scope,
      declarations  = node.declarations,
      d, i = 0;

  if (node.kind === 'var') {
    variableScope = scope.fs; // Use function scope
  }

  scope.iterate(declarations.length, function (i, next) {
    d = declarations[i];

    if (d.init !== null) {
      scope.walk(d.init, function (value) {
        variableScope.set(d.id.name, value, next);
      });
    } else {
      variableScope.set(d.id.name, undefined, next);
    }
  }, callback);
}