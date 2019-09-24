const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');
const ImageModel = require('../models/image');
const CommentModel = require('../models/comment');

module.exports = {
  index: function(req, res) {
    const viewModel = { image: {}, comments: [] };

    ImageModel.findOne({ filename: { $regex: req.params.image_id } }, function(
      err,
      image,
    ) {
      if (err) throw err;
      if (image) {
        // 增加该图片的访问量
        image.views += 1;
        viewModel.image = image;
        image.save();

        CommentModel.find(
          { image_id: image._id },
          {},
          { sort: { timestamp: 1 } },
          function(err, comments) {
            if (err) throw err;
            viewModel.comments = comments;
            sidebar(viewModel, function(viewModel) {
              res.render('image', viewModel);
            });
          },
        );
      } else {
        res.redirect('/');
      }
    });
  },
  create: function(req, res) {
    var tempPath = req.file.path;
    var imgUrl = req.file.filename;
    var ext = path.extname(req.file.originalname).toLowerCase();
    var targetPath = path.resolve('./public/upload/' + imgUrl + ext);

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
      fs.rename(tempPath, targetPath, function(err) {
        if (err) throw err;
        const newImg = new ImageModel({
          title: req.body.title,
          description: req.body.description,
          filename: imgUrl + ext,
        });
        newImg.save(function(err, image) {
          if (err) throw err;
          res.redirect('/images/' + image.uniqueId);
        });
      });
    } else {
      fs.unlink(tempPath, function(err) {
        if (err) throw err;
        res.json(500, { error: '只允许上传图片文件.' });
      });
    }
  },
  like: function(req, res) {
    ImageModel.findOne({ filename: { $regex: req.params.image_id } }, function(
      err,
      image,
    ) {
      if (!err && image) {
        image.likes += 1;
        image.save(function(err) {
          if (err) res.json(err);
          else res.json({ likes: image.likes });
        });
      }
    });
  },
  remove: function(req, res) {
    ImageModel.findOne({ filename: { $regex: req.params.image_id } }, function(
      err,
      image,
    ) {
      if (err) throw err;
      fs.unlink(path.resolve('./public/upload/' + image.filename), function(
        err,
      ) {
        if (err) throw err;
        CommentModel.remove({ image_id: image._id }, function(err) {
          image.remove(function(err) {
            if (!err) {
              res.json(true);
            } else {
              res.json(false);
            }
          });
        });
      });
    });
  },
  comment: function(req, res) {
    ImageModel.findOne({ filename: { $regex: req.params.image_id } }, function(
      err,
      image,
    ) {
      if (!err && image) {
        const newComment = new CommentModel(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        newComment.save(function(err, comment) {
          if (err) throw err;
          res.redirect('/images/' + image.uniqueId + '#' + comment._id);
        });
      } else {
        res.redirect('/');
      }
    });
  },
};
