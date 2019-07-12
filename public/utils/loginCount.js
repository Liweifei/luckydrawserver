var dbTool = require("../dbTool/dbTool");
var collectionName = "loginCount";
var loginCountInstance = {//统计登录次数
    count: function (cb) {
        dbTool.findOne(collectionName, {name:"loginCount"}, function (resons) {
            if (!!resons) {
                let thisCount=++resons.loginCount;
                let updateStr = { $set: { "loginCount": thisCount,date:new Date()} }
                dbTool.updateOne(collectionName, {name:"loginCount"}, updateStr, function (result) {
                    type = result;
                    cb(type, thisCount)
                })
            } else {
                dbTool.insertOne(collectionName, {loginCount:1,name:"loginCount",date:new Date()}, function (result) {
                    type = result;
                    cb(type, 1)
                })
            }
        })
    }
}

module.exports = loginCountInstance;
