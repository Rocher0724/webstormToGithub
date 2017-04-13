var NodeClass = require('./NodeClass');

var nodeClass = new NodeClass();

nodeClass.setMessage('Good to See u!');
nodeClass.setNumber(123);
console.log(nodeClass.getMessage());
console.log(nodeClass.getNumber());