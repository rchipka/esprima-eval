'use strict';

module.exports = function (self, node, callback) {
  var bodies = node.body.body,
      name   = node.id.name;
  
  // node.params.forEach(function(key) {
  //     if(key.type == 'Identifier'){
  //       self.data[key.name] = ;
  //     }
  // });
  // restore the self.data and scope after we self.child(node.type).walk
  // self.data = oldData;
  if (bodies.length === 0) {
    self.set(name, function (node) {
      console.log('called', name);
    });

    return callback();
  }

  self.await(name);
  for (var i = 0; i < bodies.length; i++) {
    var bnode = bodies[i];
    self.child(bnode.type).walk(bnode, function (value) {
      if (index === bodies.length - 1) {
        self.set(name, value);
      }
    });
  }

  return;
}