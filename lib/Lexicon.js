'use strict';

module.exports = {
  Program: function Program(scope, node, callback) {
    return scope.walkArray(node.body, callback);
  },
  Literal: function Literal(scope, node, callback) {
    return callback(node.value, scope.data);
  },
  Identifier: function Indentifier(scope, node, callback) {
    return scope.get(node.name, callback, function () {
      throw new Error('No Identifier ' + node.name);
    });
  },
  ThisExpression: function (scope, node, callback) {
    return scope.get('this', callback);
  },
  SelfExpression: function (scope, node, callback) {
    return scope.get('this', callback);
  },
  ReturnStatement: function (scope, node, callback) {
    return scope.tryWalk(node.argument, function (v) {
      console.log('return', v);
      return callback(v);
    });
  },
  TemplateElement: function (scope, node, callback) {
    return callback(node.value.cooked);
  },
  ExpressionStatement: function (scope, node, callback) {
    return scope.walk(node.expression, callback);
  },
  BlockStatement: function BlockStatement(scope, node, callback) {
    return scope.childBlock(function (child) {
      return child.walkArray(node.body, callback);
    });
  },
  SequenceExpression: function (scope, node, callback) {
    scope.iterate(node.expressions.length, function (i, next) {
      scope.walk(node.expressions[i], next);
    }, callback);
  },
  AssignmentExpression:   require('../lexicon/AssignmentExpression.js'),
  ArrayExpression:        require('../lexicon/ArrayExpression.js'),
  UnaryExpression:        require('../lexicon/UnaryExpression.js'),
  ObjectExpression:       require('../lexicon/ObjectExpression.js'),
  BinaryExpression:       require('../lexicon/BinaryExpression.js'),
  LogicalExpression:      require('../lexicon/BinaryExpression.js'),
  UpdateExpression:       require('../lexicon/UpdateExpression.js'),
  CallExpression:         require('../lexicon/CallExpression.js'),
  MemberExpression:       require('../lexicon/MemberExpression.js'),
  ConditionalExpression:  require('../lexicon/ConditionalExpression.js'),
  FunctionExpression:     require('../lexicon/FunctionExpression.js'),
  FunctionDeclaration:    require('../lexicon/FunctionDeclaration.js'),
  VariableDeclaration:    require('../lexicon/VariableDeclaration.js'),
  IfStatement:            require('../lexicon/IfStatement.js'),
  ForStatement:           require('../lexicon/ForStatement.js'),
  TemplateLiteral:        require('../lexicon/TemplateLiteral.js')
};