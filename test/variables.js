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

describe('Variable Assignment', function () {
  describe('Global scope', function () {

    it('should work using `var`', function (done) {
      var scope = new esEval.Scope({});

      create(function () {
        var x = 1;
      })(scope, function (a) {
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });

    it('should work using `let`', function (done) {
      var scope = new esEval.Scope({});

      create(function () {
        let x = 1;
      })(scope, function (a) {
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });

    it('should work using none', function (done) {
      var scope = new esEval.Scope({});

      create(function () {
        x = 1;
      })(scope, function (a) {
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });
  });

  describe('Function scope', function () {

    it('should work using `var`', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        var ret = (function () {
          var x = 1,
              y = (function () {
                assert.equal(__scope__.data.x, undefined);
                return x;
              })();
        })();
      })(scope, function (ret) {
        assert.strictEqual(ret, 1);
        assert.strictEqual(scope.data.x, undefined);
        done();
      });
    });

    it('should work using `let`', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        let ret = (function () {
          let x = 1,
              y = (function () {
                assert.equal(__scope__.data.x, undefined);
                return x;
              })();
        })();
      })(scope, function (ret) {
        assert.strictEqual(ret, 1);
        assert.strictEqual(scope.data.x, undefined);
        done();
      });
    });
  });

  describe('Block scope', function () {
    it('should work using `let`', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        if (true) {
          let x = 1;
          assert.strictEqual(__scope__.data.x, 1);
          assert.strictEqual(__scope__.parent.data.x, undefined);
        }

        x;
      })(scope, function (ret) {
        assert.strictEqual(ret, undefined);
        assert.strictEqual(scope.data.x, undefined);
        done();
      });
    });

    it('should\'t work using `var`', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        if (true) {
          var x = 1;
          assert.strictEqual(__scope__.data.x, undefined);
          assert.strictEqual(__scope__.parent.data.x, 1);
        }

        x;
      })(scope, function (ret) {
        assert.strictEqual(ret, 1);
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });

    it('should\'t work using `none`', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        if (true) {
          x = 1;
          assert.strictEqual(__scope__.data.x, undefined);
          assert.strictEqual(__scope__.parent.data.x, 1);
        }

        x;
      })(scope, function (ret) {
        assert.strictEqual(ret, 1);
        assert.strictEqual(scope.data.x, 1);
        done();
      });
    });
  });

  describe('Scope inheritance', function () {
    it('should overwrite existing globals', function (done) {
      var scope = new esEval.Scope({ assert, x: false });

      create(function () {
        assert.strictEqual(x, false);
        x = true;
      })(scope, function (ret) {
        assert.strictEqual(ret, true);
        assert.strictEqual(scope.data.x, true);
        done();
      });
    });

    it('should overwrite parent scope', function (done) {
      var scope = new esEval.Scope({ assert });

      create(function () {
        (function () {
          var x = false;

          (function () {
            assert.strictEqual(x, false);
            x = true;
          })();
          
          assert.strictEqual(x, true);

          return x;
        })();
      })(scope, function (ret) {
        assert.strictEqual(ret, true);
        done();
      });
    });
  });
});

// should not be able to override Function.prototype.call, etc.
// Object.getPrototypeOf(function) shouldn't be native proto
// functions should work when passing to eval