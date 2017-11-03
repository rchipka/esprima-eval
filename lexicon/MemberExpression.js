'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.object, function (object) {
    if (node.property.type === 'Identifier') {
      var prop = node.property.name;

      return callback(getProp(object, prop), object, prop);
    }

    scope.walk(node.property, function (prop) {
      return callback(getProp(object, prop), object, prop);
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