const mongoose = require('mongoose');

const ResourcesSchema = new mongoose.Schema({
      name: {
        type: String,
        unique: true,
        required: true,
        primary: true
      },
      imgUrl: {
        type: String,
        required: true
      },
      links: [
        {
          title: {
            type: String,
            required: true
          },
          url: {
            type: String,
            required: true
          }
        }
      ]
});

const Resource = mongoose.model('Resources', ResourcesSchema);

module.exports = Resource;