const express = require('express');
const mongoose = require('mongoose');
const configure = require('./server/configure');

app = express();
app = configure(app);

// 建立数据库连接
mongoose.connect('mongodb://localhost/instagrammy');
mongoose.connection.on('open', function() {
  console.log('Mongoose connected.');
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log(`Server is running on http://localhost:${app.get('port')}`);
});
