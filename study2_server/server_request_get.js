var http = require('http');

var url = require('url');

var querystring = require('querystring');

var server = http.createServer(function (request, response) {
    console.log('--- log start ---');

    var parsedUrl = url.parse(request.url);
    console.log('parsedUrl : ');
    console.log(parsedUrl);

    var parsedQuery = querystring.parse(parsedUrl.query, '&', '=');
    console.log('parsedQuery : ');
    console.log(parsedQuery);

    console.log('--- log end ---');
    var result1 = parsedQuery.abc1;
    response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    response.end('var1의 값은 ' + parsedQuery.abc1);
})

server.listen(8080, function () {
    console.log('server is running...');
});