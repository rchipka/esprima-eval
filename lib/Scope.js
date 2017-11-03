'use strict';

var Globals = require('./Globals.js'),
    Lexicon = {
      Program: function (scope, node, callback) {
        return scope.walkArray(node.body, callback);
      },
      Literal: function (scope, node, callback) {
        return callback(node.value);
      },
      Identifier: function (scope, node, callback) {
        return scope.get(node.name, callback);
      },
      SelfExpression: function (scope, node, callback) {
        return scope.get('this', callback);
      },
      ReturnStatement: function (scope, node, callback) {
        return scope.child(node.type).walk(node.argument);
      },
      TemplateElement: function (scope, node, callback) {
        return callback(node.value.cooked);
      },
      ExpressionStatement: function (scope, node, callback) {
        return scope.walk(node.expression, callback);
      },
      AssignmentExpression:   require('../lexicon/AssignmentExpression.js'),
      ArrayExpression:        require('../lexicon/ArrayExpression.js'),
      UnaryExpression:        require('../lexicon/UnaryExpression.js'),
      ObjectExpression:       require('../lexicon/ObjectExpression.js'),
      BinaryExpression:       require('../lexicon/BinaryExpression.js'),
      LogacalExpression:      require('../lexicon/BinaryExpression.js'),
      CallExpression:         require('../lexicon/CallExpression.js'),
      MemberExpression:       require('../lexicon/MemberExpression.js'),
      ConditionalExpression:  require('../lexicon/ConditionalExpression.js'),
      FunctionExpression:     require('../lexicon/FunctionExpression.js'),
      FunctionDeclaration:    require('../lexicon/FunctionDeclaration.js'),
      VariableDeclaration:    require('../lexicon/VariableDeclaration.js'),
      TemplateLiteral:        require('../lexicon/TemplateLiteral.js')
    };

function Scope(parent, isBlock) {
  if (parent instanceof Scope) {
    this.parent = parent;
    this.depth = parent.depth + 1;
    this.data = {};

    if (isBlock === true) {
      this.fs = parent.fs;
    } else {
      this.fs = this;
    }

    for (var key in parent) {
      if (this.hasOwnProperty(key) === false) {
        this[key] = parent[key];
      }
    }
  } else {
    this.parent = null;
    this.data = Globals(parent);
    this.fs = this;
    this.depth = 0;
  }

  return this;
}

Scope.prototype.child = function (isBlock) {
  return new Scope(this, isBlock);
}

Scope.prototype.get = function (key, callback) {
  // console.log('get', key, this.depth);

  if (key === 'this') {
    callback(this.fs.data.this);
    return;
  }

  if (this.data.hasOwnProperty(key) === false) {
    this.getParent(function (parent) {
      parent.get(key, callback);
    }, callback);

    return;
  }

  callback(this.data[key]);
}

Scope.prototype.set = function (key, value, callback) {
  // TODO: `this`, `arguments` should only check hasOwnProp
  // console.log(this.name, 'set: ', key, '=', value);

  this.data[key] = value;

  return callback(value);
}

var util = require('util');
Scope.prototype.walk = function (node, callback) {
  if (node === Scope.prototype.FAIL) {
    callback(node);
  }

  if (node instanceof Array) {
    return this.walkArray(node, callback);
  }

  // console.log(util.inspect(node, {depth: 1}));

  return Lexicon[node.type](this, node, callback);
}

Scope.prototype.walkArray = function (array, callback) {
  var scope = this;

  scope.iterate(array.length, function (i, next) {
    scope.walk(array[i], next);
  }, callback);
}

Scope.prototype.iterate = function (length, callback, done) {
  if (length === 0) {
    return done();
  }

  var i = -1,
      last = null,
      count = 0,
      next = function (value) {
        if (value === Scope.prototype.FAIL) {
          console.log("FAIL:", value);
          done(value);
          return;
        }

        if (++i < length) {
          callback(i, next);

          if (++count === length) {
            done(last);
          }
        } else {
          last = value;
        }
      };

  return next();
}

Scope.prototype.getParent = function (resolve, reject) {
  if (this.parent === null) {
    reject();
    return;
  }

  resolve(this.parent);
}

Scope.prototype.setHandle = function (name, callback) {
  this[name] = callback;

  return this;
}

Scope.prototype.FAIL = {};

module.exports = Scope;