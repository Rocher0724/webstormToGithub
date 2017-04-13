/**
 * Created by myPC on 2017-04-12.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookie = require('cookie-parser');

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, 'c://workspaces/node_webstorm/uploads/')
        cb(null, 'uploads/')

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);

    }
});
var upload = multer({ storage: _storage });
var app = express();

var mime = require('mime');
// 몽고디비 모듈 추가
var client = require('mongodb').MongoClient;
// post에서 넘어온 변수 값 객체화 모듈
var querystring = require('querystring');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user', express.static('uploads')); //  /user 라는 주소를 입력하면 /uploads 라는 주소로 보내준다. 이미지 받아써먹으려고 사용함
app.use(cookie('!@#%%@#@')); //cookie 암호화. 암호화된 쿠키를 서버로 보냄.

// 쿠키부분인데 잘 모르겠다.
app.get('/cookie', function(req, res){
    if(req.cookies.count){
        var cookie_count = parseInt(req.cookies.count);
    } else{
        cookie_count = 0;
    }
    cookie_count = cookie_count + 1;
    res.cookie('count', cookie_count);
    res.send('count : ' + cookie_count);
});


app.post("/post",(req,res)=>{
    var postdata = req.body;
    console.log(postdata);
    createData(res, postdata);
});

app.get('/post', (req, res) => {
    console.log("app.get./postingdata 들어왔다.");

    readAll(res);
});

app.post('/upload', upload.single('userfile'), (req, res) => {
    console.log(req.file);
    res.send('Uploaded : ' + req.file);
});
// req.file 에서 날아오는것
// fieldname
// originalname : 사용자가 업로드한 파일의 원래이름
// encoding : 인코딩 방법
// mimetype : 타입명 ex png
// size : 파일의 크기
// destination : 파일의 저장위치
// filename : 임의로 부여된 파일이름
// path
// buffer


// sign up// sign in
// app.post('/signup')


app.listen(80, () => {
    console.log('Server is running......');
});

// 3. 동기방식의 파일읽기. 파일을 읽은 후 data 변수에 저장
// var data = fs.readFileSync('server.js', 'utf-8');
// console.log('02 readSync: %s',data);

function readAll(response) {
    var data = '';
    client.connect('mongodb://localhost:27017/HR', function (error, db) {
        if (error) {
            console.log(error);
        } else {
            // 1. find( ) 함수에 아무런 입력값이 없으면 컬렉션의 전체 document 를 읽어온다.
            db.collection('postingdata').find().toArray(function (err, docs) {
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
function createData(response, data){
    //data = JSON.parse(data);
    client.connect('mongodb://localhost:27017/HR', (error, db)=>{
        if(error) {
            send500(response, error);
        } else {
            var post = {    _id:data._id
                        , title:data.title
                        , content:data.content
                        , nDate:data.nDate
                        , imageUrl:data.imageUrl
                        , emotionUrl:data.emotionUrl};
            db.collection('postingdata').insert(post);
            db.close();
            data = 'SUCCESS';
            send200(response, data, 'text/html');
        }
    });
}