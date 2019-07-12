var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dbTool = require("./public/dbTool/dbTool");
var jsonTool = require("./public/jsonTool/jsonTool");
var moment = require("./public/utils/moment");
var schedule = require("./public/utils/schedule");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurant = require('./routes/restaurant');

var app = express();

dbTool.connect();
schedule.init()
// 设置跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// token拦截验证
app.use(function (req, res, next) {
  // 把设置token的验证去掉
  if (req.url == '/user/login') {
    next();
  }else{
    let token=req.get("Authorization");
    if(!!!token || token=="undefined"){
      res.json(jsonTool.justCodeInt(false,"身份验证失败！"))
    }else{
      dbTool.findOne("token",{token:token},function(resons){
        if (!!resons) {
          console.log(resons)
          let timeDiff=moment().diff(resons.updateTime,"hours");
          console.log(timeDiff)
          if(timeDiff>1){
            res.json(jsonTool.justCodeInt(false,"身份验证失败！"))
          }else{
            next();
          }
        }else{
          next();
        }
      })
    }
  }
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/restaurant', restaurant);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3889); // 设定监听端口
 
//启动监听
var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
});

// module.exports = app;
