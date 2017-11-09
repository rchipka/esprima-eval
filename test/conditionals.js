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

// TODO: write tests for all conditional expressions

// instanceof should work with null

describe('Conditionals', function () {
  describe('If Statement', function () {
    it('should work with truthy value', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = false;
        
        if (1) {
          x = true;
        } else {
          assert.fail();
        }

        assert.ok(x);
      })(scope, done);
    });

    it('should work with !truthy value', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = false;
        
        if (!x) {
          x = true;
        } else {
          assert.fail();
        }

        assert.ok(x);
      })(scope, done);
    });

    it('should work with &&', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = false;
        
        if (!x && true) {
          x = true;
        } else {
          assert.fail();
        }

        assert.ok(x);
      })(scope, done);
    });

    it('should work with ||', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = false;
        
        if (x || true) {
          x = true;
        } else {
          assert.fail();
        }

        assert.ok(x);
      })(scope, done);
    });

    it('should work with instanceof', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = function () {},
            count = 0;
        
        if (x instanceof Function) {
          count++;
        } else {
          assert.fail();
        }

        assert.ok(count);
      })(scope, done);
    });

    it('should work with many logical expressions', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = false;
        
        if (x || true && 0 || 1) {
          x = true;
        } else {
          assert.fail();
        }

        assert.ok(x);
      })(scope, done);
    });

    it('should work with nested logical expressions', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var x = false;
        
        if (x || (true && 0) || (1 && ('' || '1'))) {
          x = true;
        } else {
          assert.fail();
        }

        assert.ok(x);
      })(scope, done);
    });
  });
});