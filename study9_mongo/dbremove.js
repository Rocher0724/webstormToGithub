var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/school', function (error, db) {
    if (error) {
        console.log(error);
    } else {
        // 1. 수정 대상 쿼리
        var query = { };
        db.collection('qna').remove(query, function (err, removed) {
            if (err) {
                console.log(err);
            } else {
                console.log('removed successfully!');
            }
        });
        db.close();
    }
});