var http = require('http');
var url = require('url');

var server = http.createServer(function (request, response) {
    console.log(request.url);
    // parsedUrl 출력값은 도메인:포트"/parsedUrl" 부분이다.
    var parsedUrl = url.parse(request.url);
    // resource 출력값은 
    var resource = parsedUrl.pathname;
    console.log('parsedUrl=%s', parsedUrl);
    console.log('resource=%s', parsedUrl.pathname);
    console.log('resource path=%s', resource);

    if (resource == '/address') {
        response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        response.end('서울시 강남구 논현1동 111');
    } else if (resource == '/phone') {
        response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        response.end('02-3545-1237');
    } else if (resource == '/name') {
        response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        response.end('Hong Gil Dong');
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('404 Page Not Found');
    }
});

server.listen(8080, () => {
    console.log('Server is running...');
})