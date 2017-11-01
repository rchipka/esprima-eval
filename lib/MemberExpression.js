'use strict';

module.exports = function (self, node, callback) {
  var obj = self.child(node.type).walk(node.object, function (obj) {

    // do not allow access to methods on Function 
    if((obj === FAIL) || (typeof obj == 'function')){
      return callback(FAIL);
    }
    if (node.property.type === 'Identifier') {
      return callback(obj[node.property.name]);
    }
    var prop = self.child(node.type).walk(node.property, function (prop) {
      if (prop === FAIL) return callback(FAIL);

      return callback(obj[prop]);
    });
  });
}