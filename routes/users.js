var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var dbTool = require("../public/dbTool/dbTool");
var jsonTool = require("../public/jsonTool/jsonTool");
var tokenTool = require("../public/tokenTool/tokenTool");
var loginCount = require("../public/utils/loginCount");
var collectionName = "user";

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* login api. */
router.post('/login', function (req, res, next) {
  if (req.body.name && req.body.psd) {
    loginCount.count(function(countType,countNum){
      if(countType){
        tokenTool.saveToken({ token: req.body.name }, function (type, drawType) {
          if (type) {
            res.json(jsonTool.toObj({ token: req.body.name, drawType: drawType,loginCount:countNum }))
          } else {
            res.json(jsonTool.justCodeInt(false, "登录失败，token未存储！"))
          }
        })
      }else{
        res.json(jsonTool.justCodeInt(false, "存储登录次数失败"))
      }
    });
  } else {
    res.json(jsonTool.justCodeInt(false, res))
  }

});

module.exports = router;
