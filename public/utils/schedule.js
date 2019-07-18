var dbTool = require("../dbTool/dbTool");
var schedule = require('node-schedule');

// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │  |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// 每分钟的第30秒触发： '30 * * * * *'

// 每小时的1分30秒触发 ：'30 1 * * * *'

// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

// 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

var scheduleInstance={//定时器
    init:function(){//保存token
        // param.updateTime=moment().format();
        // let type=false;
        // dbTool.findOne(collectionName,{token:param.token},function(resons){
        //     if (!!resons) {
        //         let updateStr={$set:{"updateTime":param.updateTime}}
        //         dbTool.updateOne(collectionName,{token:param.token},updateStr,function(result){
        //             type=result;
        //             cb(type)
        //         })
        //     }else{
        //         dbTool.insertOne(collectionName,param,function(result){
        //             type=result;
        //             cb(type)
        //         })
        //     }
        // })
        this.resetDrawType()
        
    },
    resetDrawType:function(){
        var updateStr={$set:{"drawType":false}}
        var updateStr3={$set:{"isToday":false}}
        schedule.scheduleJob('0 0 1 * * *',function(){//每天的0点0分重置抽奖 
            dbTool.updateMany("token",{},updateStr,function(result){
                console.log(result+'重置抽奖次数任务中:' + new Date());
            })
            dbTool.updateMany("restaurant",{},updateStr3,function(result){
                console.log(result+'重置今天抽中项目:' + new Date());
            })
        });
        var updateStr2={$set:{"isSelected":0,"isToday":false}}//
        schedule.scheduleJob('0 0 0 * * 1',function(){//每周1的0 点 0 分 0秒执行饭店可选重置
            dbTool.updateMany("restaurant",{},updateStr2,function(result){
                console.log(result+'每周饭店可选重置任务中:' + new Date());
            })
        }); 
    }
}

module.exports = scheduleInstance;
