# esprima-eval

Static evaluation on Esprima ASTs

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