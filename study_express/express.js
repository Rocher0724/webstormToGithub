var http = require('http');
var express = require('express');
var url = require('url');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/hello", (req, res) => {
    fs.readFile('hello.html', 'utf-8', (error, data) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('500 Internal Server Error : ' + error);
            // 2.2 아무런 오류가 없이 정상적으로 읽기가 완료되면 파일의 내용을 클라이언트에 전달
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    })
})
app.post('/upload', upload.single('userfile1'), (req, res) => {
    console.log(req.file);
    res.send('Uploaded : ' + req.file.filename);
});
//    } else if (resource == "/upload") {

//        if (request.method == "POST") {
//            var data = 'uploaded';
//            send200(response, data, 'application/json');
//        }

//    } else {
//        response.writeHead(404, { 'Content-Type': 'text/html' });
//        response.end('404 Page Not Found');
//    }
//});

http.createServer(app).listen(80, () => {
    console.log('Server is running...');
});




function send200(response, data, mimeType) {
    console.log('send200입니다 ' + data);
    response.writeHead(200, { 'Content-Type': mimeType });
    response.end(data);
}