'use strict';

var Globals = require('./lib/Globals.js'),
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
        return scope.walk(node.argument, callback);
      },
      TemplateElement: function (scope, node, callback) {
        return callback(node.value.cooked);
      },
      ExpressionStatement: function (scope, node, callback) {
        return scope.walk(node.expression, callback);
      },
      BlockStatement: function (scope, node, callback) {
        return scope.child(true).walk(node.body, callback);
      },
      SequenceExpression: function (scope, node, callback) {
        scope.iterate(node.expressions.length, function (i, next) {
          scope.walk(node.expressions[i], next);
        }, callback);
      },
      AssignmentExpression:   require('./lexicon/AssignmentExpression.js'),
      ArrayExpression:        require('./lexicon/ArrayExpression.js'),
      UnaryExpression:        require('./lexicon/UnaryExpression.js'),
      ObjectExpression:       require('./lexicon/ObjectExpression.js'),
      BinaryExpression:       require('./lexicon/BinaryExpression.js'),
      LogicalExpression:      require('./lexicon/BinaryExpression.js'),
      UpdateExpression:      require('./lexicon/UpdateExpression.js'),
      CallExpression:         require('./lexicon/CallExpression.js'),
      MemberExpression:       require('./lexicon/MemberExpression.js'),
      ConditionalExpression:  require('./lexicon/ConditionalExpression.js'),
      FunctionExpression:     require('./lexicon/FunctionExpression.js'),
      FunctionDeclaration:    require('./lexicon/FunctionDeclaration.js'),
      VariableDeclaration:    require('./lexicon/VariableDeclaration.js'),
      IfStatement:            require('./lexicon/IfStatement.js'),
      ForStatement:            require('./lexicon/ForStatement.js'),
      TemplateLiteral:        require('./lexicon/TemplateLiteral.js')
    };

function Scope(parent, isBlock) {
  if (parent instanceof Scope) {
    this.parent = parent;
    this.global = parent.global;
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
    this.global = this;
    this.data = Globals(parent);
    this.fs = this;
    this.depth = 0;
  }

  this.data.__scope__ = this;

  return this;
}

Scope.prototype.child = function (isBlock) {
  return new Scope(this, isBlock);
}

Scope.prototype.get = function (key, callback) {
  // console.log('get', key, this.depth, this.data);

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

  callback(this.data[key], this.data, key);
}

Scope.prototype.getScopeOf = function (key, resolve, reject) {
  if (this.data.hasOwnProperty(key) === false) {
    this.getParent(function (parent) {
      parent.getScopeOf(key, resolve, reject);
    }, reject);

    return;
  }

  resolve(this);
}

Scope.prototype.set = function (key, value, callback, inBlockScope) {
  // TODO: `this`, `arguments` should only check hasOwnProp
  // console.log(this.name, 'set: ', key, '=', value);
  var self = this;

  this.getScopeOf(key, function (scope) {
    scope.data[key] = value;
  }, function () {
    if (inBlockScope === true) {
      self.data[key] = value;
      return;
    }

    self.fs.data[key] = value;
  });

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

  // console.log(node.type);
  // console.log(util.inspect(node, {depth: 2}));

  // if (this.hasOwnProperty(node.type)) {
  //   return Lexicon[node.type](this, node, function (value) {
  //     self[node.type].call(null, node, callback, value);
  //   });
  // }

  if (Lexicon.hasOwnProperty(node.type) === false) {
    return this.error(node, 'Unkown token ' + JSON.stringify(node.type), callback);
  }

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

Scope.prototype.on = function (name, callback) {
  if (this.hasOwnProperty(name) === false) {
    this[name] = callback;
    return;
  }

  var prev = this[name];

  this[name] = function () {
    var length = arguments.length,
        args = new Array(length + 1);

    args.push(function (value) {
      args[length]     = args[length - 1];
      args[length - 1] = value;

      callback.apply(null, args);
    });

    prev.apply(null, args);
  };

  return this;
}

Scope.prototype.error = function (node, message, callback) {
  console.log(node);
  throw new Error(message);
};

Scope.prototype.fail = function (callback) {
  throw new Error('failed');
};

(module.exports = Scope).Scope = Scope;