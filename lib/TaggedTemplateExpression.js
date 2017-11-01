'use strict';

module.exports = function (self, node, callback) {
  var quasi = node.quasi;
  callback();

  // self.child(node.type).walk(node.tag, function (tag) {
  //   quasi.quasis.map(function (q) {
  //     walk(q, function (strings) {

  //   var values = quasi.expressions.map(walk,);
  //   });

  //   return tag.apply(null, [strings].concat(values));
  // });
}