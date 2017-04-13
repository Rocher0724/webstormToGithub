var fs = require('fs');

var data = "My first data.../r/nhello there!";

fs.writeFile('file01_async.txt', data, 'utf-8', function (e) {
    if (e) {
        console.log(e);
    } else {
        console.log('01 WRITE DONE!');
    }
})

try {
    fs.writeFileSync('file02_sync.txt', data, 'utf-8');
    console.log('02 WRITE DONE!');
} catch (e) {
    console.log(e);
}