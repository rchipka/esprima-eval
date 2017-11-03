'use strict';

module.exports = function (globals) {
  if (globals.hasOwnProperty('Function') === false) {
    function FunctionGlobal() {
      return this;
    }

    extend(Object, FunctionGlobal);
    extend(Function, FunctionGlobal);
    extend(Function.prototype, FunctionGlobal.prototype);

    globals.Function = FunctionGlobal;
  }

  if (globals.hasOwnProperty('Object') === false) {
    function ObjectGlobal() {
      return this;
    }

    ObjectGlobal.getPrototypeOf = function (object) {
      var prototype = Object.getPrototypeOf(object);

      if (prototype === Function.prototype) {
        return FunctionGlobal.prototype;
      }
    }

    extend(Object, ObjectGlobal);
    extend(Object.prototype, ObjectGlobal.prototype);

    globals.Object = ObjectGlobal;
  }

  return globals;
}

function extend(source, target) {
  for (var key in source) {
    if (target.hasOwnProperty(key) === false) {
      target[key] = source[key];
    }
  }
}