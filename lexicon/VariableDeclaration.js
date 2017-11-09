'use strict';

var util = require('util');

module.exports = function (scope, node, callback) {
  var variableScope = scope,
      declarations  = node.declarations,
      d, i = 0,
      setInBlockScope = (node.kind === 'let');

  scope.iterate(declarations.length, function (i, next) {
    d = declarations[i];

    if (d.init !== null) {
      scope.walk(d.init, function (value) {
        variableScope.set(node, d.id.name, value, next, setInBlockScope);
      });
    } else {
      variableScope.set(node, d.id.name, undefined, next, setInBlockScope);
    }
  }, callback);
}