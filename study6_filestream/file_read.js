var fs = require('fs');

fs.readFile('./study3/home.js', 'utf-8', function (error, data) {
    console.log('01 readAsync : %s', data);
});

var data = fs.readFileSync('./study3/home.js', 'utf-8');
console.log('02 readSync : %s', data);