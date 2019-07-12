var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/luckydraw";
var thisDb={};
var dbInstance={
	connect:function(){
		MongoClient.connect(url, function(err, client) {
			if (err) throw err;
			console.log("数据库已创建!");
			thisDb=client.db("luckydraw");
		})
	},
	insertOne: function (collectionName, param, cb) {//插入一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        //插入数据
        collection.insertOne(param,{}, function (err, result) {
            if (err) {
            	throw err;
            	cb(false);
            	return;
            }
            console.warn(result)
            cb(true);
        });
    },
    findOne: function (collectionName, whereStr, cb) {//查询一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find(whereStr).toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }else{
                console.log(result,"长度"+result.length)
                if (result.length<1) {
                    cb(false);
                }else{
                   cb(result[0]); 
                }
                
            }
        })
    },
    findAll: function (collectionName, cb) {//查找表的全部数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find().toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                cb(false,err)
                return;
            }
            cb(true,result);
        })
    },
    findByStr: function (collectionName,whereStr, cb) {//根据条件查找全部数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find(whereStr).toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                cb(false,err)
                return;
            }
            cb(true,result);
        })
    },
    deleteOne: function (collectionName, whereStr, cb) {//删除一条数据
        //连接到表
        console.log(whereStr)
        var collection = thisDb.collection(collectionName);
        //删除数据
        collection.remove(whereStr, function (err, result) {
            if (err) {
                throw err;
                cb(false);
                return;
            }
            cb(true);
        });
    },
    updateOne: function (collectionName, whereStr, updateStr, cb) {//更新一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        //更新数据
        collection.updateOne(whereStr,updateStr, function (err, result) {
            if (err) {
                throw err;
                return;
            }
            cb(true);
        });
    },
    updateMany: function (collectionName, whereStr, updateStr, cb) {//更新所有数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        //更新数据
        console.log("更新条件："+collectionName,whereStr,updateStr)
        collection.updateMany(whereStr,updateStr, function (err, result) {
            if (err) {
                throw err;
                cb(false);
                return;
            }
            cb(true);
        });
    },
}

module.exports = dbInstance;