var Client = require('mongodb').MongoClient;

//  여기서 first는 데이터베이스의 이름이다.
Client.connect('mongodb://localhost:27017/first', function (error, db) {
    if (error) {
        console.log(error);
    } else {

        
        //var query = { gender: 'F' };
        // age에 있어서 16보다 크고 19보다 작은것을 선택한다.
        var query = { gender: 'F', age: { '$gt': 16, '$lt': 19 } };
        // name이랑 age는 불러오고 _id는 안불러온다.
        var projection = { name: 1, age: 1, _id: 0 };
        var projection2 = { name: 0 , _id: 0 };
        //var cursor = db.collection('first').find(query,projection);
        var cursor = db.collection('first').find(query).skip(2).limit();
        cursor.each((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                if (doc != null) {
                    console.log(doc);
                }
            }
        });
        db.close();
    }
});