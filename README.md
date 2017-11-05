# esprima-eval

Fast static evaluation on ESTree-compatible ASTs

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

# Features

 * Comprehensive tests
 * Fully asynchronous API and internals
 * ECMA 3 and IE8 compatible
 * ESNext support