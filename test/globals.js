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

describe('Globals', function () {
  describe('Function', function () {
    it('should not overwrite external Function object', function (done) {
      var func = function () {},
          scope = new esEval.Scope({ assert, func });

      create(function () {
        Function = func;
        assert.strictEqual(__scope__.data.Function, func);
      })(scope, function () {
        assert.ok(scope.data.Function);
        assert.notStrictEqual(scope.data.Function, Function);
        done();
      });
    });

    it('should not overwrite external Function prototype', function (done) {
      var proto = {},
          scope = new esEval.Scope({ assert, proto, console });

      create(function () {
        Function.prototype = proto;
        assert.strictEqual(__scope__.data.Function.prototype, proto);
        __scope__.data.Function.prototype;
      })(scope, function (p) {
        assert.strictEqual(scope.data.Function.prototype, p);
        assert.notStrictEqual(scope.data.Function.prototype, Function.prototype);
        done();
      });
    });

    it('should not modify external Function object', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        Function.test = 1;
        assert.strictEqual(__scope__.data.Function.test, 1);
        __scope__.data.Function;
      })(scope, function (func) {
        assert.strictEqual(scope.data.Function, func);
        assert.strictEqual(scope.data.Function.test, 1);
        assert.strictEqual(Function.test, undefined);
        done();
      });
    });

    it('should not modify external Function prototype', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        Function.prototype.test = 1;
        assert.strictEqual(__scope__.data.Function.prototype.test, 1);
        __scope__.data.Function.prototype;
      })(scope, function (proto) {
        assert.strictEqual(scope.data.Function.prototype, proto);
        assert.strictEqual(scope.data.Function.prototype.test, 1);
        assert.strictEqual(Function.prototype.test, undefined);
        done();
      });
    });

    it('should work with instanceof', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = function Test() {};
        assert.ok(x instanceof Function);
      })(scope, done);
    });
  });
});