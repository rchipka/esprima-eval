'use strict';

var assert = require('assert'),
    parse = require('esprima').parseScript,
    esEval = require('../'),
    util = require('util');

function create(func) {
  var ast = parse(func.toString().replace(/^[^\{]+\s*\{/, '').replace(/\}\s*$/, ''));
  // console.log(util.inspect(ast, {depth: null}));
  return function (scope, callback) {
    scope.walk(ast, callback);
  }
}

describe('Loops', function () {
  describe('For loop', function () {
    it('should work with single update operation', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var count = 0;
        for (var i = 0; i < 2; i++) {
          count++;
        }
        assert.strictEqual(count, 2);
        assert.strictEqual(i, 2);
      })(scope, done);
    });

    it('should work with multiple update operations', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var count = 0;
        for (var i = 0, m = 0; i < 2 && m > (i - 1); i++, ++m) {
          count++;
        }
        assert.strictEqual(count, 2);
        assert.strictEqual(i, 2);
        assert.strictEqual(m, 2);
      })(scope, done);
    });
  });
});