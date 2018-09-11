'use strict';

var util = require('util');

module.exports = function (scope, node, callback) {
  var variableScope = scope,
      declarations  = node.declarations,
      d, i = 0,
      setInBlockScope = (node.kind === 'let');

  scope.iterate(declarations.length, function (i, next) {
    d = declarations[i];

    return scope.tryWalk(d.init, function (value) {
      return variableScope.assign(d.id.name, value, next, setInBlockScope);
    });
  }, callback);
}