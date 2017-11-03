'use strict';

var assert = require('assert'),
    parse = require('esprima').parseScript,
    esEval = require('../'),
    util = require('util');


function create(func) {
  var ast = parse(func.toString().replace(/^[^\{]+\s*\{/, '').replace(/\}\s*$/, ''));
  // console.log(util.inspect(ast, {depth: null}));
  return esEval(ast);
}

describe('VariableDeclaration', function () {
  describe('Set a value in global scope', function () {

    it('using `var`', function (done) {
      var scope = new esEval.Scope({});

      create(function () {
        var x = 1;
      })(scope, function (a) {
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });

    it('using `let`', function (done) {
      var scope = new esEval.Scope({});

      create(function () {
        let x = 1;
      })(scope, function (a) {
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });

    it('using none', function (done) {
      var scope = new esEval.Scope({});

      create(function () {
        x = 1;
      })(scope, function (a) {
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });
  });
});

// should not be able to override Function.prototype.call, etc.
// Object.getPrototypeOf(function) shouldn't be native proto
// functions should work when passing to eval