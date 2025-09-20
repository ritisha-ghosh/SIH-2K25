const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Internship', InternshipSchema);
