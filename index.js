'use strict';

(module.exports = function (ast, options) {
  return function (scope, callback) {
    return scope.walk(ast, callback);
  };
}).Scope = require('./lib/Scope.js');