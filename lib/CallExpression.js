'use strict';

module.exports = function (self, node, callback) {
  self.child(node.type).walk(node.callee, function (callee) {

    console.log('call:', node.type, node.callee, callee);
    if (callee === FAIL) return FAIL;
    if (typeof callee !== 'function') return FAIL;
    
    self.child(node.type).walk(node.callee.object, function (ctx) {
      if (ctx === FAIL) ctx = null;

      return callee.apply(ctx, callee);
    });
  });
}