'use strict';

var Globals = require('./Globals.js'),
    Lexicon = require('./Lexicon.js'),
    InternalProxy = require('./Proxy.js');

function _hasOwnProperty(object, property) {
  if (!object) {
    return;
  }

  return Object.prototype.hasOwnProperty.call(object, property);
}


function Scope(parent, type) {
  if (parent instanceof Scope) {
    this.parent = parent;
    this.global = parent.global;
    this.depth = parent.depth + 1;
    this.data = {};
    this.type = type;

    if (type === Scope.type.block) {
      this.function = parent.function;
      this.block    = this;
    } else if (type === Scope.type.function) {
      this.function = this;
      this.block    = parent.block;
    } else {
      this.function = parent.function;
      this.block    = parent.block;
    }

    for (var key in parent) {
      if (this.hasOwnProperty(key) === false) {
        this[key] = parent[key];
      }
    }
  } else {
    this.parent   = null;
    this.global   = this;
    this.data     = Globals(parent);
    this.depth    = 0;
    this.function = this;
    this.block    = this;
    this.type     = Scope.type.function;
  }

  this.data.__scope__ = this;

  return this;
}

Scope.prototype.child = function child(type, callback) {
  return callback(new Scope(this, type));
};

Scope.prototype.childBlock = function childBlock(callback) {
  return this.child(Scope.type.block, callback);
};

Scope.prototype.childFunction = function childFunction(context, args, callback) {
  return this.child(Scope.type.function, callback);
};

Scope.prototype.getProperty = function getProperty(node, object, prop, resolve, reject) {
  if (typeof object === 'undefined') {
    throw new Error('Cannot read property ' + JSON.stringify(prop) + ' of undefined');
  }

  if (object instanceof InternalProxy) {
    return object.get(this, node, object, prop, resolve, reject);
  }

  if (_hasOwnProperty(object,prop) &&
      typeof object[prop] === 'function') {
    return resolve(object[prop].bind(object));
  }

  return resolve(object[prop], object, prop);
};

Scope.prototype.get = function get(key, resolve, reject) {
  // console.log('get', key, this.depth, this.data);

  if (key === 'this') {
    if (this.function.data.this !== undefined) {
      return resolve(this.function.data.this);
    }

    return reject();
  }

  return this.getScopeOf(key, function (scope) {
    return resolve(scope.data[key], scope.data, key);
  }, reject);
};

Scope.prototype.getScopeOf = function getScopeOf(key, resolve, reject) {
  if (_hasOwnProperty(this.data, key) === false) {
    return this.getParent(function (parent) {
      return parent.getScopeOf(key, resolve, reject);
    }, reject);
  }

  return resolve(this);
};

Scope.prototype.set = function set(key, value, callback, inBlockScope) {
  // TODO: `this`, `arguments` should only check hasOwnProp
  // TODO: implement setFunction() since function param names will overwrite parent scope
  // console.log(this.name, 'set: ', key, '=', value);
  var self = this;

  if (key === this && value === undefined) {
    return callback(value);
  }

  return this.getScopeOf(key, function (scope) {
    if (scope.data[key] instanceof InternalProxy) {
      return scope.data[key].set(node, scope, object, prop, value, callback);
    }

    return callback(scope.data[key] = value);
  }, function () {
    return self.assign(key, value, callback, inBlockScope);
  });
};

Scope.prototype.assign = function (key, value, callback, inBlockScope) {
  var scope = this.function;

  if (inBlockScope === true) {
    scope = this.block;
  }

  return callback((scope.data[key] = value), scope.data, key);
}

Scope.prototype.call = function call(node, callee, context, args, resolve, reject) {
  if (context instanceof Scope) {
    context = this.global.data;
  }

  if (callee instanceof InternalProxy) {
    return callee.apply(this, node, callee, context, args, resolve);
  }

  if (typeof callee !== 'function') {
    this.error(node, JSON.stringify(callee) + ' is not a function', resolve);
    return;
  }

  if (callee.hasOwnProperty('__internal__')) {
    return callee.__internal__(context, args, resolve);
  }

  console.log('real call', callee, context, args);

  return resolve(callee.apply(context, args), context);
};

Scope.prototype.tryWalk = function (node, callback, defaultValue) {
  if (node === null) {
    return callback(defaultValue);
  }

  return this.walk(node, callback);
}

Scope.prototype.walk = function walk(node, callback) {
  if (Lexicon.hasOwnProperty(node.type) === false) {
    return this.error(node, 'Unkown token ' + JSON.stringify(node.type), callback);
  }

  return Lexicon[node.type](this, node, callback);
};

Scope.prototype.walkArray = function walkArray(array, callback) {
  var scope = this;

  if ((array instanceof Array) === false) {
    return this.walk(array, callback);
  }

  return scope.iterate(array.length, function (i, next) {
    return scope.walk(array[i], next);
  }, callback);
};

Scope.prototype.iterate = function iterate(length, callback, done, value) {
  if (length === 0) {
    return done();
  }

  var i = 0,
      next = function (value) {
        if (i + 1 < length) {
          return callback(i++, next, done, value);
        } else {
          return callback(i++, done, done, value);
        }
      };

  return next(value);
};

Scope.prototype.getParent = function getParent(resolve, reject) {
  if (this.parent === null) {
    return reject();
  }

  return resolve(this.parent);
};

Scope.prototype.on = function on(name, callback) {
  var self = this,
      prev = this[name];

  this[name] = callback;

  this['_' + name] = prev;

  return this;
};

Scope.prototype.serialize = function (callback, data) {
  this.getParent(function (parent) {
    if (data === undefined) {
      callback(parent.data);
    }

  }, callback)
};

Scope.prototype.error = function error(node, message, callback) {
  console.log(node);
  throw new Error(message);
};

Scope.prototype.fail = function fail(callback) {
  throw new Error('failed');
};

Scope.prototype.Scope = Scope;

Scope.type = {
  block: 0,
  function: 1
};

Scope.InternalProxy = Scope.Proxy = InternalProxy;

module.exports = Scope;