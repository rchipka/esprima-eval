'use strict';

(module.exports = function (ast, options) {
  return function (scope, callback) {
    scope.walk(ast, callback);
  };
}).Scope = require('./lib/Scope.js');