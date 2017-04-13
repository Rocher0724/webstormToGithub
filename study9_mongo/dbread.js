/**
 * Created by myPC on 2017-04-13.
 */
var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/first', function(error, db){
    if(error) {
        console.log(error);
    } else {
        // 1. 수정 대상 쿼리
        // var query = {name:'James', age:4 , gender : 'M'};
        var query = {name : "James", age: 15};

        var cursor = db.collection('first').find(query);
        cursor.each((err,doc) => {
           if(err) {
               console.log(err);
           } else {
               if ( doc!= null ) {
                   console.log(doc);
                   console.log("\n\r");
                   console.log(doc.name);
               }
           }
        });

        db.close();
    }
});