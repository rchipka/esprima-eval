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