const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('./config');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

config.contracts.forEach((contract) => {
  app.use((req, res, next) => {
    const reg = new RegExp(`^/api/${contract.name}`);
    const result = req.url.match(reg);

    const alias = config.alias[contract.name] || contract.name;
    const aliasReg = new RegExp(`^/api/${alias}`);
    const aliasResult = req.url.match(reg);
    if(result || aliasResult)
      req.contract = { ...contract };
    next();
  })
})

// app.use('/api/eth/broadcast', broadcast);
// 引入routes目录下模块，文件名为模块名称
fs.readdirSync('./routes').forEach((route) => {
	if(!route.match(/^\w/)) return;
	const res = route.match(/^(\w+)(\.js)?/);
	if(!res) return;
	const routeName = res[1];
  	config.contracts.forEach(contract => {
    		app.use(`/api/${contract.name}/${routeName}`, require(`./routes/${route}`));
  	});
})

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
