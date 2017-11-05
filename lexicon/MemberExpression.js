'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.object, function (object) {
    if (node.property.type === 'Identifier') {
      var prop = node.property.name;

      return callback(getProp(node, scope, object, prop), object, prop);
    }

    scope.walk(node.property, function (prop) {
      return callback(getProp(node, scope, object, prop), object, prop);
    });
  });
}

function getProp(node, scope, object, prop) {
  if (typeof object === 'undefined') {
    return scope.error(node, 'Cannot read property ' + JSON.stringify(prop) + ' of undefined');
  }

  if (typeof object[prop] === 'function' &&
      !object.hasOwnProperty(prop)) {
    return object[prop].bind(object);
  }

  // console.log('Get Member', object, prop, object[prop]);
  
  return object[prop];
}