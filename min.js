(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"_process":1,"inherits":2}],5:[function(require,module,exports){
'use strict';

var Globals = require('./lib/Globals.js'),
    Lexicon = {
      Program: function (scope, node, callback) {
        return scope.walkArray(node.body, callback);
      },
      Literal: function (scope, node, callback) {
        return callback(node.value);
      },
      Identifier: function (scope, node, callback) {
        return scope.get(node.name, callback);
      },
      SelfExpression: function (scope, node, callback) {
        return scope.get('this', callback);
      },
      ReturnStatement: function (scope, node, callback) {
        return scope.walk(node.argument, callback);
      },
      TemplateElement: function (scope, node, callback) {
        return callback(node.value.cooked);
      },
      ExpressionStatement: function (scope, node, callback) {
        return scope.walk(node.expression, callback);
      },
      BlockStatement: function (scope, node, callback) {
        return scope.child(true).walk(node.body, callback);
      },
      SequenceExpression: function (scope, node, callback) {
        scope.iterate(node.expressions.length, function (i, next) {
          scope.walk(node.expressions[i], next);
        }, callback);
      },
      AssignmentExpression:   require('./lexicon/AssignmentExpression.js'),
      ArrayExpression:        require('./lexicon/ArrayExpression.js'),
      UnaryExpression:        require('./lexicon/UnaryExpression.js'),
      ObjectExpression:       require('./lexicon/ObjectExpression.js'),
      BinaryExpression:       require('./lexicon/BinaryExpression.js'),
      LogicalExpression:      require('./lexicon/BinaryExpression.js'),
      UpdateExpression:       require('./lexicon/UpdateExpression.js'),
      CallExpression:         require('./lexicon/CallExpression.js'),
      MemberExpression:       require('./lexicon/MemberExpression.js'),
      ConditionalExpression:  require('./lexicon/ConditionalExpression.js'),
      FunctionExpression:     require('./lexicon/FunctionExpression.js'),
      FunctionDeclaration:    require('./lexicon/FunctionDeclaration.js'),
      VariableDeclaration:    require('./lexicon/VariableDeclaration.js'),
      IfStatement:            require('./lexicon/IfStatement.js'),
      ForStatement:           require('./lexicon/ForStatement.js'),
      TemplateLiteral:        require('./lexicon/TemplateLiteral.js')
    };

function Scope(parent, node, isBlock) {
  if (parent instanceof Scope) {
    this.parent = parent;
    this.global = parent.global;
    this.depth = parent.depth + 1;
    this.data = {};

    if (isBlock === true) {
      this.functionScope = parent.functionScope;
    } else {
      this.functionScope = this;
    }

    for (var key in parent) {
      if (this.hasOwnProperty(key) === false) {
        this[key] = parent[key];
      }
    }
  } else {
    this.parent = null;
    this.global = this;
    this.data = Globals(parent);
    this.functionScope = this;
    this.depth = 0;
  }

  this.data.__scope__ = this;

  return this;
}

Scope.prototype.child = function (node, isBlock) {
  return new Scope(this, isBlock);
};

Scope.prototype.get = function (key, callback) {
  // console.log('get', key, this.depth, this.data);

  if (key === 'this') {
    callback(this.functionScope.data.this);
    return;
  }

  this.getScopeOf(key, function (scope) {
    callback(scope.data[key], scope.data, key);
  }, callback);
};

Scope.prototype.getScopeOf = function (key, resolve, reject) {
  if (this.data.hasOwnProperty(key) === false) {
    return this.getParent(function (parent) {
      parent.getScopeOf(key, resolve, reject);
    }, reject);
  }

  return resolve(this);
};

Scope.prototype.set = function (key, value, callback, inBlockScope) {
  // TODO: `this`, `arguments` should only check hasOwnProp
  // console.log(this.name, 'set: ', key, '=', value);
  var self = this;

  this.getScopeOf(key, function (scope) {
    scope.data[key] = value;
  }, function () {
    if (inBlockScope === true) {
      self.data[key] = value;
      return;
    }

    self.functionScope.data[key] = value;
  });

  return callback(value);
};

var util = require('util');
Scope.prototype.walk = function (node, callback) {
  if (node === Scope.prototype.FAIL) {
    callback(node);
  }

  if (node instanceof Array) {
    return this.walkArray(node, callback);
  }

  // console.log(node.type);
  // console.log(util.inspect(node, {depth: 2}));

  // if (this.hasOwnProperty(node.type)) {
  //   return Lexicon[node.type](this, node, function (value) {
  //     self[node.type].call(null, node, callback, value);
  //   });
  // }

  if (Lexicon.hasOwnProperty(node.type) === false) {
    return this.error(node, 'Unkown token ' + JSON.stringify(node.type), callback);
  }

  return Lexicon[node.type](this, node, callback);
};

Scope.prototype.walkArray = function (array, callback) {
  var scope = this;

  scope.iterate(array.length, function (i, next) {
    scope.walk(array[i], next);
  }, callback);
};

Scope.prototype.iterate = function (length, callback, done) {
  if (length === 0) {
    return done();
  }

  var i = -1,
      last = null,
      count = 0,
      next = function (value) {
        if (++i < length) {
          callback(i, next);
        } else {
          last = value;
        }

        if (count++ === length) {
          done(last);
        }
      };

  return next();
};

Scope.prototype.getParent = function (resolve, reject) {
  if (this.parent === null) {
    reject();
    return;
  }

  resolve(this.parent);
};

Scope.prototype.on = function (name, callback) {
  var prev = this[name];

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

Scope.prototype.error = function (node, message, callback) {
  console.log(node);
  throw new Error(message);
};

Scope.prototype.fail = function (callback) {
  throw new Error('failed');
};

(module.exports = Scope).Scope = Scope;
},{"./lexicon/ArrayExpression.js":6,"./lexicon/AssignmentExpression.js":7,"./lexicon/BinaryExpression.js":8,"./lexicon/CallExpression.js":9,"./lexicon/ConditionalExpression.js":10,"./lexicon/ForStatement.js":11,"./lexicon/FunctionDeclaration.js":12,"./lexicon/FunctionExpression.js":13,"./lexicon/IfStatement.js":14,"./lexicon/MemberExpression.js":15,"./lexicon/ObjectExpression.js":16,"./lexicon/TemplateLiteral.js":17,"./lexicon/UnaryExpression.js":18,"./lexicon/UpdateExpression.js":19,"./lexicon/VariableDeclaration.js":20,"./lib/Globals.js":21,"util":4}],6:[function(require,module,exports){
'use strict';

module.exports = function (self, node, callback) {
  var length = node.elements.length,
      array = Array(length);

  if (length < 1) {
    return callback(array);
  }

  var push = function (value) {
    if (array.push(value) === length) {
      callback(array);
    }
  }

  for (var i = 0, l = length; i < l; i++) {
    self.child(node.elements[i].type).walk(node.elements[i], function (value) {
      push(value);
    });
  }

  return;
}
},{}],7:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.left, function (left, object, prop) {
    var setScope = scope;

    if (typeof left === 'undefined' && typeof prop !== 'string') {
      if (node.left.type === 'Identifier') {
        // TODO: shouldn't set in strict mode
        setScope = scope.global;
      } else {
        scope.error(node, 'Left-hand assignment undefined', callback);
        return;
      }
    }

    scope.walk(node.right, function (right) {
      if (typeof prop === 'string') {
        callback(object[prop] = right);
        return;
      }

      setScope.set(node.left.name, right, callback);
    });
  });
}
},{}],8:[function(require,module,exports){
'use strict';

var ops = {
  '==': function (l, r, callback) {
    return callback(l == r);
  },
  '===': function (l, r, callback) {
    return callback(l === r);
  },
  '!=': function (l, r, callback) {
    return callback(l != r);
  },
  '!==': function (l, r, callback) {
    return callback(l !== r);
  },
  '+': function (l, r, callback) {
    return callback(l + r);
  },
  '-': function (l, r, callback) {
    return callback(l - r);
  },
  '*': function (l, r, callback) {
    return callback(l * r);
  },
  '/': function (l, r, callback) {
    return callback(l / r);
  },
  '%': function (l, r, callback) {
    return callback(l % r);
  },
  '<': function (l, r, callback) {
    return callback(l < r);
  },
  '>': function (l, r, callback) {
    return callback(l > r);
  },
  '>=': function (l, r, callback) {
    return callback(l >= r);
  },
  '<=': function (l, r, callback) {
    return callback(l <= r);
  },
  '|': function (l, r, callback) {
    return callback(l | r);
  },
  '&': function (l, r, callback) {
    return callback(l & r);
  },
  '^': function (l, r, callback) {
    return callback(l ^ r);
  },
  '&&': function (l, r, callback) {
    return callback(l && r);
  },
  '||': function (l, r, callback) {
    return callback(l || r);
  },
  'instanceof': function (l, r, callback, scope) {
    if (l instanceof Function && r === scope.global.data.Function) {
      return callback(true);
    }
    
    return callback(l instanceof r);
  }
};

module.exports = function (scope, node, callback) {
  scope.child(node.type).walk(node.left, function (l) {
    scope.child(node.type).walk(node.right, function (r) {
      return ops[node.operator](l, r, callback, scope);
    });
  });
}
},{}],9:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  var ret;

  scope.walk(node.callee, function (callee, object, prop) {
    if (typeof callee !== 'function') {
      scope.error(node, JSON.stringify(callee) + ' is not a function', callback);
      return;
    }

    var args = new Array(node.arguments.length);

    scope.iterate(node.arguments.length, function (index, next) {
      scope.walk(node.arguments[index], function (value) {
        next(args[index] = value);
      });
    }, function () {
      if (callee.hasOwnProperty('__internal__')) {
        ret = callee.__internal__(args, callback);
        return;
      }

      // console.log('Real Call', callee, object, args);

      // TODO: .apply() null or `object`?
      callback(ret = callee.apply(null, args));
    });
  });

  return ret;
}
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (self, node, callback) {
  self.child(node.type).walk(node.test, function (val) {
    if (val) {
      self.child(node.type + ' TRUE').walk(node.consequent, callback);
    } else {
      self.child(node.type + ' FALSE').walk(node.alternate, callback);
    }
  });
}
},{}],11:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  var iterate = function (done) {
    scope.walk(node.test, function (value) {
      if (value == false) {
        return done();
      }

      scope.walk(node.body, function () {
        scope.walk(node.update, function () {
          iterate(done);
        });
      });
    });
  };

  scope.walk(node.init, function () {
    iterate(callback);
  });
}
},{}],12:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  var body = node.body,
      name = node.id.name,
      params = node.params,
      func = function () {
        var length = arguments.length,
            args = new Array(length),
            i = 0;

        for (; i < length; i++) {
          args[i] = arguments[i];
        }

        return func.__internal__(args, function () {});
      };

  func.__internal__ = function (args, callback) {
    var child = scope.child(),
        ret;

    child.set('arguments', args, function () {
      child.iterate(args.length, function (i, next) {
        var param = params[i];

        if (param.type === 'Identifier') {
          child.set(param.name, args[i], next);
        } else {
          child.walk(param, next);
        }
      }, function () {
        child.walk(body, function (value) {
          callback(ret = value);
        });
      });
    });

    return ret;
  }

  scope.set(name, func, callback);
}
},{}],13:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  var body = node.body.body,
      params = node.params,
      func = function () {
        var length = arguments.length,
            args = new Array(length),
            i = 0;

        for (; i < length; i++) {
          args[i] = arguments[i];
        }

        return func.__internal__(args, function () {});
      };

  func.__internal__ = function (args, callback) {
    var child = scope.child(node),
        ret;

    child.set('arguments', args, function () {
      child.iterate(args.length, function (i, next) {
        var param = params[i];

        if (param.type === 'Identifier') {
          child.set(param.name, args[i], next);
        } else {
          child.walk(param, next);
        }
      }, function () {
        scope.iterate(body.length, function (i, next) {
          child.walk(body[i], next);
        }, function (value) {
          callback(ret = value);
        });
      });
    });

    return ret;
  }

  callback(func);

  return func;
}
},{}],14:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.test, function (value) {
    if (value) {
      scope.walk(node.consequent, callback);
      return;
    }

    if (node.alternate !== null) {
      scope.walk(node.alternate, callback);
    }
  });
}
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  var properties = node.properties,
      length = properties.length,
      count  = 0,
      object = {};

  if (length < 1) {
    return callback(object);
  }

  scope.iterate(length, function (index, next) {
    var prop = properties[index];

    scope.walk(prop.value, function (value) {
      object[prop.key.name] = value;

      next(object);
    });
  }, callback);
}
},{}],17:[function(require,module,exports){
'use strict';

module.exports = function (self, node, callback) {
  var str = '',
      expressions = node.expressions,
      length = expressions.length;
      index = 0,
      iterate = function (index, array, cb, done) {
        if (index < length) {
          return cb(expressions[index++], function () {
            iterate(index, array, cb, done);
          });
        }

        return done();
      };

  return iterate(0, quasis, function (quasis, next) {
      self.child(node.type).walk(quasis, function (value) {
        str += value;
        next();
      });
  }, function () {
    iterate(0, expressions, function (expression, next) {
      self.child(node.type).walk(expression, function (value) {
        str += value;
        next();
      });
    }, function () {
      self.child(node.type).walk(node.quasis[length], function (value) {
        str += value;
        callback(str);
      });
    });
  });
}
},{}],18:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.argument, function (value) {
    if (node.operator === '+') return callback(+value);
    if (node.operator === '-') return callback(-value);
    if (node.operator === '~') return callback(~value);
    if (node.operator === '!') return callback(!value);

    return scope.fail(callback);
  });
}
},{}],19:[function(require,module,exports){
'use strict';

module.exports = function (scope, node, callback) {
  scope.walk(node.argument, function (value, object, prop) {
    if (typeof prop === 'undefined') {
      return scope.error(node, 'No prop', callback);
    }

    // TODO: handle `prefix: true`

    if (node.operator === '++') {
      value++;
    } else if (node.operator === '--') {
      value--;
    }

    callback(object[prop] = value);
  });
}
},{}],20:[function(require,module,exports){
'use strict';

var util = require('util');

module.exports = function (scope, node, callback) {
  var variableScope = scope,
      declarations  = node.declarations,
      d, i = 0,
      setInBlockScope = (node.kind === 'let');

  scope.iterate(declarations.length, function (i, next) {
    d = declarations[i];

    if (d.init !== null) {
      scope.walk(d.init, function (value) {
        variableScope.set(node, d.id.name, value, next, setInBlockScope);
      });
    } else {
      variableScope.set(node, d.id.name, undefined, next, setInBlockScope);
    }
  }, callback);
}
},{"util":4}],21:[function(require,module,exports){
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

  if (globals.hasOwnProperty('Math') === false) {
    var MathGlobal = {};

    extend(Math, MathGlobal);

    globals.Math = MathGlobal;
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
},{}]},{},[5]);
