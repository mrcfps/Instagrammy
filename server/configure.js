const path = require('path');
const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');

module.exports = function(app) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser('secret-value'));
  app.use('/public/', express.static(path.join(__dirname, '../public')));

  if (app.get('env') === 'development') {
    app.use(errorHandler());
  }

  return app;
};
