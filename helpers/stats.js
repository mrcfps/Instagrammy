const async = require('async');
const ImageModel = require('../models/image');
const CommentModel = require('../models/comment');

module.exports = function(callback) {
  async.parallel(
    [
      function(next) {
        // 统计图片总数
        ImageModel.count({}, next);
      },
      function(next) {
        // 统计评论总数
        CommentModel.count({}, next);
      },
      function(next) {
        // 对图片所有访问量求和
        ImageModel.aggregate(
          [
            {
              $group: {
                _id: '1',
                viewsTotal: { $sum: '$views' },
              },
            },
          ],
          function(err, result) {
            if (err) {
              return next(err);
            }
            var viewsTotal = 0;
            if (result.length > 0) {
              viewsTotal += result[0].viewsTotal;
            }
            next(null, viewsTotal);
          },
        );
      },
      function(next) {
        // 对所有点赞数求和
        ImageModel.aggregate(
          [
            {
              $group: {
                _id: '1',
                likesTotal: { $sum: '$likes' },
              },
            },
          ],
          function(err, result) {
            if (err) {
              return next(err);
            }
            var likesTotal = 0;
            if (result.length > 0) {
              likesTotal += result[0].likesTotal;
            }
            next(null, likesTotal);
          },
        );
      },
    ],
    function(err, results) {
      callback(null, {
        images: results[0],
        comments: results[1],
        views: results[2],
        likes: results[3],
      });
    },
  );
};
