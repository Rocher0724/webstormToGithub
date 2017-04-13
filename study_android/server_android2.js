var http = require('http');
var url = require('url');
var fs = require('fs');
var multer = require('multer');

var mime = require('mime');
// 몽고디비 모듈 추가
var client = require('mongodb').MongoClient;
// post에서 넘어온 변수 값 객체화 모듈
var querystring = require('querystring');

// 1. 서버생성
var server = http.createServer((request, response) => {
    var parsedUrl = url.parse(request.url);
    var res = parsedUrl.pathname;
    // 제일 앞에 /를 제거하면 fs.readfild 에서 실제 경로상의 파일을 접근할 수 있다.

    if (res == "/") {
        res = "/index.html"
    }
    res = res.substring(1);


    if (res == "post") {
        // 쓰기부분 
        if (request.method == "POST") {
            // 요청에 넘어온 post의 body를 읽어서 postdata에 담는다.
            var postdata = '';
            request.on('data', function (data) {
                postdata = postdata + data;
            });

            // post data를 다 읽고나면 end event가 발생해서 아래 로직이 실행된다.
            request.on('end', function () {
                // var data = querystring.parse(postdata);
                console.log('createData 들어가기 직전');
                createData(response, postdata);
            });
            // 읽기부분
        } else if (request.method == "GET") {
            readAll(response);

            // 메소드 지원안함 오류처리
        } else { 
            send404(response);
        }
    } else if (res == "upload") {
        if (request.method == "POST") {
            var data = 'uploaded';
            send200(response, data, 'application/json');
        }
    } else {

        var resMime = mime.lookup(res); // 파일의 mimeType을 가져온다.

        console.log("mime = " + resMime);

        // 요청된 파일의 mimetyped이 texthtml일 경우 처리  그이외의 mimetype은 모두 else에서 처리 
        if (resMime == "text/html") {
            // 파일을 읽어서 전송한다.
            fs.readFile(res, 'utf-8', function (error, data) {
                send200(response, data, resMime);
            });
        } else {
            fs.readFile(res, function (error, data) {
                if (error) {
                    send404(response);
                } else {
                    send200(response, data, resMime);

                }
            });
        }
    }

});


server.listen(8080, () => {
    console.log("server is running...");
})
// 3. 동기방식의 파일읽기. 파일을 읽은 후 data 변수에 저장
// var data = fs.readFileSync('server.js', 'utf-8');
// console.log('02 readSync: %s',data);

function readAll(response) {
    var data = '';
    client.connect('mongodb://localhost:27017/school', function (error, db) {
        if (error) {
            console.log(error);
        } else {
            // 1. find( ) 함수에 아무런 입력값이 없으면 컬렉션의 전체 document 를 읽어온다.
            db.collection('qna').find().toArray(function (err, docs) {
                data = '{"data":' + JSON.stringify(docs) + '}';
                console.log(data);
                send200(response, data, 'application/json');
            });

            db.close();
        }
    });
}

function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('<h1>404 Page not Found</h1>');
}
function send200(response, data, mimeType) {
    console.log('send200입니다 ' + data);
    response.writeHead(200, { 'Content-Type': mimeType });
    response.end(data);
}
function send500(response) {
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.end('500 server internal error.');
}
function createData(response, data) {
    data = JSON.parse(data);
    client.connect('mongodb://localhost:27017/school', function (error, db) {
        if (error) {
            send500(response);
        } else {
            // 1. 입력할 document 생성
            var post = { title: data.title, content: data.content, name: data.name };

            // 2. student 컬렉션의 insert( ) 함수에 입력
            db.collection('qna').insert(post);
            db.close();
            response.writeHead(200, { 'Content-Type': 'text/html' });
            // data = '<html><head><meta charset="UTF-8"/></head><body>등록되었습니다</body></html>';
            data = "SUCCESS";
            send200(response, data, 'text/html');
        }
    });
}