const fs = require('fs');
const path = require('path');

module.exports = {
  index: function(req, res) {
    const viewModel = {
      image: {
        uniqueId: 1,
        title: '示例图片1',
        description: '这是张测试图片',
        filename: 'sample1.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now(),
      },
      comments: [
        {
          image_id: 1,
          email: 'test@testing.com',
          name: 'Test Tester',
          comment: 'Test 1',
          timestamp: Date.now(),
        },
        {
          image_id: 1,
          email: 'test@testing.com',
          name: 'Test Tester',
          comment: 'Test 2',
          timestamp: Date.now(),
        },
      ],
    };
    res.render('image', viewModel);
  },
  create: function(req, res) {
    var tempPath = req.file.path;
    var imgUrl = req.file.filename;
    var ext = path.extname(req.file.originalname).toLowerCase();
    var targetPath = path.resolve('./public/upload/' + imgUrl + ext);

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
      fs.rename(tempPath, targetPath, function(err) {
        if (err) throw err;
        res.redirect('/images/' + imgUrl);
      });
    } else {
      fs.unlink(tempPath, function(err) {
        if (err) throw err;
        res.json(500, { error: '只允许上传图片文件.' });
      });
    }
  },
  like: function(req, res) {
    res.send('The image:like POST controller');
  },
  comment: function(req, res) {
    res.send('The image:comment POST controller');
  },
};
