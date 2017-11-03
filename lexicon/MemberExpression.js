'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.object, function (object) {

    console.log('got object', object);

    if (object === scope.FAIL){
      return callback(scope.FAIL);
    }

    if (node.property.type === 'Identifier') {
      return callback(getProp(object, node.property.name));
    }

    scope.walk(node.property, function (prop) {
      if (prop === scope.FAIL) {
        return callback(scope.FAIL);
      }

      return callback(getProp(object, prop));
    });
  });
}

function getProp(object, prop) {
  if (typeof object[prop] === 'function' &&
      !object.hasOwnProperty(prop)) {
    return object[prop].bind(object);
  }

  return object[prop];
}