var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/school', function(error, db){
    if(error) {
        console.log(error);
    } else {
        // 1. 수정 대상 쿼리
        // var query = {name:'James', age:4 , gender : 'M'};
        var query = {title: '99', content: '99'};
        // 2. 데이터 수정 명령 : set 명령을 사용하면 특정 field의 값만 변경할 수 있음
        // db.users.update( {_id:"terry"}, {$set :{ city:"Busan" } } );
        var operator = {title:'99', content: '99', name: 'M'};
        // 3. 수정 옵션 : upsert 가 true 일 경우 query 대상이 존재하면 update, 없으면 insert 처리
        var option = {upsert:false};
        db.collection('qna').update(query,operator,option,function(err,upserted){
            if(err){
                console.log(err);
            }else{
                console.log('updated successfully!');
            }
        });
        db.close();
    }
});