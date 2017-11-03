'use strict';

module.exports = function (self, node, callback) {
  self.child(node.type).walk(node.left, function (l) {
    if (l === FAIL) return FAIL;

    self.child(node.type).walk(node.right, function (r) {
      if (r === FAIL) return FAIL;
      
      var op = node.operator;
      if (op === '==') return l == r;
      if (op === '===') return l === r;
      if (op === '!=') return l != r;
      if (op === '!==') return l !== r;
      if (op === '+') return l + r;
      if (op === '-') return l - r;
      if (op === '*') return l * r;
      if (op === '/') return l / r;
      if (op === '%') return l % r;
      if (op === '<') return l < r;
      if (op === '<=') return l <= r;
      if (op === '>') return l > r;
      if (op === '>=') return l >= r;
      if (op === '|') return l | r;
      if (op === '&') return l & r;
      if (op === '^') return l ^ r;
      if (op === '&&') return l && r;
      if (op === '||') return l || r;
      
      return FAIL;
    });
  });

  return;
}