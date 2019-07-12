var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var dbTool = require("../public/dbTool/dbTool");
var jsonTool = require("../public/jsonTool/jsonTool");
var collectionName = "restaurant";

/* save restaurant. */
router.post('/save', function (req, res, next) {
  if (req.body.name && req.body.location) {
    dbTool.findByStr(collectionName,{"user": req.get("Authorization")}, function (type, arr) {
      if (type) {
        if (arr.length >= 8) {
          res.json(jsonTool.justCodeInt(false, "只能加入8条数据哦！"))
          return;
        }
        dbTool.findOne(collectionName, { "name": req.body.name,"user": req.get("Authorization") }, function (resons) {
          if (!!resons) {
            res.json(jsonTool.justCodeInt(false, "饭店已存在哦！"))
          } else {
            var data = req.body;
            data.createDate = new Date();
            data.user = req.get("Authorization");
            dbTool.insertOne(collectionName, data, function (result) {
              var msg = result ? '添加成功！' : '添加失败！';
              res.json(jsonTool.justCodeInt(result, msg))
            })
          }
        })
      } else {
        res.json(jsonTool.justCodeInt(arr, info))
      }


    })
  }
});

/* remove restaurant. */
router.post('/delete', function (req, res, next) {
  if (req.body._id) {
    var whereStr = { '_id': ObjectId(req.body._id) };
    dbTool.deleteOne(collectionName, whereStr, function (result) {
      var msg = result ? '删除成功！' : '删除失败！';
      res.json(jsonTool.justCodeInt(result, msg))
    })
  }
});

/* update restuarant. */
router.post('/update', function (req, res, next) {
  if (req.body._id) {
    var whereStr = { '_id': ObjectId(req.body._id) };
    var updateStr = {
      $set:
      {
        "name": req.body.name,
        "location": req.body.location,
        "isSelected": req.body.isSelected,
        "score": req.body.score,
        createDate: new Date()
      }
    }
    dbTool.updateOne(collectionName, whereStr, updateStr, function (result) {
      var msg = result ? '编辑成功！' : '编辑失败！';
      res.json(jsonTool.justCodeInt(result, msg))
    })
  } else {
    res.json(jsonTool.justCodeInt(false, "未找到该条数据"))
  }
});

/* draw this restuarant. */
router.post('/draw', function (req, res, next) {
  if (req.body._id) {
    var whereStr = { '_id': ObjectId(req.body._id) };
    var updateStr = {
      $set:
      {
        "isSelected": 1,
        "isToday":true
      }
    }
    dbTool.updateOne(collectionName, whereStr, updateStr, function (result) {
      var updateStr2 = { $set: { "drawType": true } }
      dbTool.updateMany("token", {}, updateStr2, function (results) {
        var msg = result ? '抽选成功！' : '抽选失败！';
        res.json(jsonTool.justCodeInt(result, msg))
      })

    })
  } else {
    res.json(jsonTool.justCodeInt(false, "未找到该条数据"))
  }
});

/* get restaurant list. */
router.get('/list', function (req, res, next) {
  console.log(req.get("Authorization"))
  dbTool.findByStr(collectionName, { user: req.get("Authorization") }, function (result, info) {
    if (result) {
      res.json(jsonTool.toArr(info))
    } else {
      res.json(jsonTool.justCodeInt(result, info))
    }
  })
});

module.exports = router;
