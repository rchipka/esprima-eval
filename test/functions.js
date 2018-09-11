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


// should error when calling non-function

describe('Functions', function () {
  describe('Declaration', function () {
    it('should work in global scope', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        function Test() {
          return 1;
        }

        assert.ok(Test);
        assert.strictEqual(Test(), 1);
      })(scope, function () {
        assert.ok(scope.data.Test);
        assert.strictEqual(typeof scope.data.Test, 'function');
        assert.strictEqual(scope.data.Test(), 1);
        done();
      });
    });

    it('should accept arguments', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var a1 = 1,
            b1 = 2,
            c1 = 'test',
            d1 = {
              test: {}
            };

        function Test(a2, b2, c2, d2, e2) {
          assert.strictEqual(a1, a2);
          assert.strictEqual(b1, b2);
          assert.strictEqual(c1, c2);
          assert.strictEqual(d1, d2);
          assert.strictEqual(d1.test, e2);
        }

        (function () {
          Test(a1, b1, c1, d1, d1.test);
        })();
      })(scope, function () {
        done();
      });
    });

    // should error when calling non function
  });

  describe('Anonymous', function () {
    it('should accept arguments', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var a1 = 1,
            b1 = 2,
            c1 = 'test',
            d1 = {
              test: {}
            };

        (function (a2, b2, c2, d2, e2) {
          assert.strictEqual(a1, a2);
          assert.strictEqual(b1, b2);
          assert.strictEqual(c1, c2);
          assert.strictEqual(d1, d2);
          assert.strictEqual(d1.test, e2);
        })(a1, b1, c1, d1, d1.test);
      })(scope, done);
    });
    // should error when calling non function
  });
});