/**
 * Created by myPC on 2017-04-13.
 */
var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/school', function (error, db) {
    if (error) {
        console.log(error);
    } else {
        var iTitle = '15';
        var iContent = '15';
        var iAddress = 'http://192.168.0.15/user/Screenshot_2014-01-28-22-18-03.png';
        var query = {title: iTitle, content: iContent};

        // 2. 데이터 수정 명령 : set 명령을 사용하면 특정 field의 값만 변경할 수 있음
        // db.users.update( {_id:"terry"}, {$set :{ city:"Busan" } } );
        console.log(iAddress);
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
        db.close();
    }
});