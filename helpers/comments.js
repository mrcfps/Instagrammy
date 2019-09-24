const async = require('async');
const ImageModel = require('../models/image');
const CommentModel = require('../models/comment');

module.exports = {
  newest: function(callback) {
    CommentModel.find({}, {}, { limit: 5, sort: { timestamp: -1 } }, function(
      err,
      comments,
    ) {
      if (err) return callback(err);
      var attachImage = function(comment, next) {
        ImageModel.findOne({ _id: comment.image_id }, function(err, image) {
          if (err) throw err;
          comment.image = image;
          next(err);
        });
      };
      async.each(comments, attachImage, function(err) {
        if (err) throw err;
        callback(err, comments);
      });
    });
  },
};
