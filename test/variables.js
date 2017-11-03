'use strict';

var assert = require('assert'),
    parse = require('esprima').parseScript,
    esEval = require('../'),
    util = require('util');


function create(func) {
  var ast = parse('(' + func.toString() + ')()');
  // console.log(util.inspect(ast, {depth: null}));
  return esEval(ast);
}

describe('VariableDeclaration', function () {
  describe('scope', function() {
    it('should set a value in scope', function (done) {
      var run = create(function ({z, y}) {
          var x = 1;
          console.log(x);
        }),
        scope = new esEval.Scope({
          console: console
        });


      run(scope, function () {
        
      console.log(scope.data);
        done();
      });
    });
  });
});

// should not be able to override Function.prototype.call, etc.
// Object.getPrototypeOf(function) shouldn't be native proto
// functions should work when passing to eval