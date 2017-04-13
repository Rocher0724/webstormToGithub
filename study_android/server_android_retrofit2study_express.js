var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');

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
app.use('/user', express.static('uploads'));


// -------------------------------------- 웹 테스트용 ----
app.get("/hello", (req, res) => {
    fs.readFile('hello.html', 'utf-8', (error, data) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('500 Internal Server Error : ' + error);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

// -------------------------------------------------------

// 데이터를 db에 입력할 때
app.post("/post",(request,response)=>{
    var postdata = request.body;
    console.log(postdata);
    createData(response, postdata);
});

// 전체 db데이터 불러오는곳
app.get('/post', (req, res) => {
    console.log("app.get 들어왔다.");

    readAll(res);
});

var fileAddress;
// 파일업로드파트
app.post('/upload', upload.single('userfile'), (req, res) => {
    fileAddress = req.file.originalname;
    res.send('Uploaded : ' + req.file);
    imageAddressInsert('x', 'x', fileAddress);
    console.log(req.file + " 이미지 업로드됨.");
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




http.createServer(app).listen(80, () => {
    console.log('Server is running...');
});
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
function createData(response, data){
    //data = JSON.parse(data);
    client.connect('mongodb://localhost:27017/school', (error, db)=>{
        if(error) {
            send500(response, error);
        } else {
            var post = {title:data.title, content:data.content, name:data.name};
            imageAddressInsert(data.title, data.content, 'x');
            db.collection('qna').insert(post);
            db.close();

            console.log("데이터가 입력되었습니다.");

            data = 'SUCCESS';
            send200(response, data, 'text/html');
        }
    });
}
var iTitle = 'x';
var iContent = 'x';
function imageAddressInsert(title, content, imageaddress){
    var iAddress = 'http://192.168.0.15/user/';
    if( title != 'x' && content != 'x') {
        console.log('타이틀 컨텐트 세팅장소');
        iTitle = title;
        iContent = content;
    }

    if ( imageaddress != 'x' ) {
        iAddress = iAddress + imageaddress;
    }
    console.log('디비등록 들어가기전');
    console.log('iTitle : ' + iTitle);
    console.log('iContent : ' + iContent);
    console.log('iAddress : ' + iAddress);
    console.log('iAddress.length : ' + iAddress.length);
    // if( iContent != null && iTitle != null && iAddress.length > 26) {
    if( iAddress.length > 26) {
        console.log('이미지 등록하는 db쿼리에 들어옴');
        client.connect('mongodb://localhost:27017/school', function (error, db) {
            if (error) {
                console.log(error);
            } else {

                var query = {title: iTitle, content: iContent};

                // 2. 데이터 수정 명령 : set 명령을 사용하면 특정 field의 값만 변경할 수 있음
                // db.users.update( {_id:"terry"}, {$set :{ city:"Busan" } } );
                
                
                console.log('디비등록 내부');
                console.log('iTitle : ' + iTitle);
                console.log('iContent : ' + iContent);
                console.log('iAddress : ' + iAddress);
                console.log('iAddress.length : ' + iAddress.length);
                
                var operator = {title: iTitle, content: iContent, name: iAddress};
                // 3. 수정 옵션 : upsert 가 true 일 경우 query 대상이 존재하면 update, 없으면 insert 처리
                var option = {upsert:false};
                db.collection('qna').update(query,operator,option,function(err,upserted){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('image address insert successfully!');
                    }
                });
                console.log(iAddress);
                console.log("외않됀데");
                db.close();
                iTitle = null;
                iContent = null;
            }
        });

    }

}