'use strict';

var TOKENS = {
  Literal: function (self, node, callback) {
    return callback(node.value);
  },
  Identifier: function (self, node, callback) {
    return self.get(node.name, callback);
  },
  SelfExpression: function (self, node, callback) {
    return self.get('self', callback);
  },
  ReturnStatement: function (self, node, callback) {
    return self.child(node.type).walk(node.argument);
  },
  TemplateElement: function (self, node, callback) {
    return callback(node.value.cooked);
  },
  ArrayExpression:        require('./lib/ArrayExpression.js'),
  UnaryExpression:        require('./lib/UnaryExpression.js'),
  ObjectExpression:       require('./lib/ObjectExpression.js'),
  BinaryExpression:       require('./lib/BinaryExpression.js'),
  LogacalExpression:      require('./lib/BinaryExpression.js'),
  CallExpression:         require('./lib/CallExpression.js'),
  MemberExpression:       require('./lib/MemberExpression.js'),
  ConditionalExpression:  require('./lib/ConditionalExpression.js'),
  ExpressionStatement:    require('./lib/ExpressionStatement.js'),
  FunctionExpression:     require('./lib/FunctionExpression.js'),
  FunctionDeclaration:    require('./lib/FunctionExpression.js'),
  TemplateLiteral:        require('./lib/TemplateLiteral.js')
};

var FAIL = {};

function Scope(parent, name) {
  this.name = name;

  if (parent === undefined) {
    this.data = {};
    this.pending = {};
  } else if (parent instanceof Scope) {
    this.parent = parent;
    this.data = Object.create(parent.data);
    this.pending = Object.create(parent.pending);
  } else {
    this.data = parent;
    this.pending = {};
  }

  this.children = [];

  return this;
}

Scope.prototype.await = function (value) {
  this.pending[value] = [];
}

Scope.prototype.child = function () {
  return new Scope(this);
}

Scope.prototype.get = function (key, callback) {
  console.log(this.name, 'get: ', key);
  callback(this.data[key]);
}

Scope.prototype.set = function (key, value, callback) {
  // TODO: `this` should only check hasOwnProp
  console.log(this.name, 'set: ', key, '=', value);

  this.data[key] = val;

  return value;
}

Scope.prototype.walk = function (node, callback) {
  console.log(node.type);

  return TOKENS[node.type](this, node, callback);
}

module.exports = Scope;