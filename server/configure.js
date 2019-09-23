const path = require('path');
const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const moment = require('moment');

const routes = require('./routes');

module.exports = function(app) {
  // 定义 moment 全局语言
  moment.locale('zh-cn');

  app.engine(
    'handlebars',
    exphbs.create({
      helpers: {
        timeago: function(timestamp) {
          return moment(timestamp).startOf('minute').fromNow();
        },
      },
    }).engine,
  );
  app.set('view engine', 'handlebars');

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser('secret-value'));
  app.use('/public/', express.static(path.join(__dirname, '../public')));

  if (app.get('env') === 'development') {
    app.use(errorHandler());
  }

  routes(app);
  return app;
};
