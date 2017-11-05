# esprima-eval

Fast evaluation on ESTree-compatible ASTs

# Features

 * Comprehensive tests
 * Fully asynchronous API and internals
 * Esprima and Cherow compatible
 * ECMA 3 and IE8 compatible
 * ESNext support

# Install

`npm install esprima-eval`

# Usage

```javascript
var esEval   = require('esprima-eval'),
    esprima  = require('esprima');

var ast   = esprima.parseScript(' ... '),
    scope = new esEval.Scope(globals);

scope.on('get', function () {
  // supports custom scope data handlers
});

scope.on('ConditionalExpression', function () {
  // supports custom lexical node handlers
});

scope.walk(ast, function (returnValue) {
  // done
});
```

# Support

## Runtime

  - [ ] Strict mode
  - [ ] Error handling
  - [ ] Error skipping/resolution

## Globals

  - [x] Protected objects/prototypes
  - [ ] `Array`
  - [x] `Function`
  - [x] `Object`
  - [ ] `Date`
  - [ ] `Number`
  - [ ] `RegExp`
  - [ ] `String`
  - [ ] `Proxy`
  - [ ] `Symbol`

## Scope

  - [x] Scope proxy
  - [x] Scope chain lookup
  - [x] Function scope (`var`)
  - [x] Block scope (`let`)

## Operations

  - [x] Binary (&, |, ^)
  - [x] Mathematical (+, -, /, *, %)
  - [x] Update before (++i, --i)
  - [ ] Update after (i++, i--)

## Conditionals

  - [x] And/or
  - [x] Strict/non-strict equality
  - [x] >=, <=
  - [x] If statements

## Loops

  - [x] For loops
  - [ ] While loops
  - [ ] `break`
  - [ ] `continue`
  - [ ] `return`

## Functions

  - [x] Function declarations
  - [x] Anonymous closures
  - [ ] Arrow functions
  - [ ] Async functions
  - [ ] Spread operator
  - [ ] Object identity

## Proxies

  - [ ] Proxy constructor
  - [ ] Has/get/set/delete property
  - [ ] Get/set property descriptor
  - [ ] Get/set prototype
  - [ ] Apply

## Promises

  - [ ] Promise constructor
  - [ ] Promise.then
  - [ ] Promise.catch

## Symbols