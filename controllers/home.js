const ImageModel = require('../models/image');

module.exports = {
  index: function(req, res) {
    const viewModel = { images: [] };

    ImageModel.find({}, {}, { sort: { timestamp: -1 } }, function(err, images) {
      if (err) throw err;
      viewModel.images = images;
      res.render('index', viewModel);
    });
  },
};
