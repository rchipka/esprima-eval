'use strict';

module.exports = function (self, node, callback) {
  self.child(node.type).walk(node.argument, function (value) {
    if (node.operator === '+') return callback(+val);
    if (node.operator === '-') return callback(-val);
    if (node.operator === '~') return callback(~val);
    if (node.operator === '!') return callback(!val);

    return callback(FAIL);
  });
}