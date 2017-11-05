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

var ast = esprima.parseScript(' ... ');

new esEval.Scope(globals).walk(ast, function (returnValue) {
  // done
});
```

# Support

## Runtime

  - [ ] Strict mode
  - [ ] Error handling
  - [ ] Error skipping/resolution


## Scope

  - [x] Scope proxying
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