'use strict';

var InternalFunction = require('../lib/Function.js');

module.exports = function FunctionExpression(scope, node, callback) {
  return InternalFunction(scope, node.params, node.body, callback);
}