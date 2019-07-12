var dbTool = require("../dbTool/dbTool");
var moment = require("../utils/moment");
var collectionName="token";

var tokenInstance={
    saveToken:function(param,cb){//保存token
        param.updateTime=moment().format();
        var type=false;
        dbTool.findOne(collectionName,{token:param.token},function(resons){
            if (!!resons) {
                var updateStr={$set:{"updateTime":param.updateTime}}
                dbTool.updateOne(collectionName,{token:param.token},updateStr,function(result){
                    type=result;
                    cb(type,resons.drawType)
                })
            }else{
                param.drawType=false;
                dbTool.insertOne(collectionName,param,function(result){
                    type=result;
                    cb(type,false)
                })
            }
        })
    },
    checkToken: function (param,cb) {//检查token是否有效
        dbTool.findOne(collectionName,{token:param.token},function(resons){
            if (!!resons) {
              var timeDiff=moment().diff(resons.updateTime,"hours");
              if(timeDiff>3){
                cb(false);
              }else{
                cb(true);
              }
            }else{
                cb(false);
            }
        })
    },
    findToken: function (param) {//查找token
        var type=false;
        dbTool.findOne(collectionName,param,function(resons){
            type=!!resons;
        })
    }
}

module.exports = tokenInstance;
