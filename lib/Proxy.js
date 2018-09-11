'use strict';

function InternalProxy(target, handler) {
  this.target = target;
  this.handler = handler;

  return this;
}

InternalProxy.prototype.get = function (scope, node, object, property, resolve, reject) {
  // console.log('proxy get', property, object);

  if (typeof this.handler.get === 'undefined') {
    return object[property];
  }

  return this.handler.get(scope, node, object, property, resolve, reject);
};

InternalProxy.prototype.apply = function (scope, node, callee, context, args, resolve, reject) {
  // console.log('proxy apply', callee, args);

  if (typeof this.handler.apply === 'undefined') {
    return;
  }

  return this.handler.apply(scope, node, callee, context, args, resolve);
};

InternalProxy.prototype.inspect = function () {
  return 'InternalProxy';
};

module.exports = InternalProxy;