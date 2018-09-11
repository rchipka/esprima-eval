'use strict';

var InternalFunction = require('../lib/Function.js');

module.exports = function FunctionDeclaration(scope, node, callback) {
  return InternalFunction(scope, node.params, node.body.body, function (func) {
    return scope.assign(node.id.name, func, callback);
  });
}