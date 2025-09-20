const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profile: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    location: { type: String, default: '' },
    education: { type: String, default: '' },
    university: { type: String, default: '' },
    graduationYear: { type: Number },
    fieldOfStudy: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experience: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    bio: { type: String, default: '' },
    interests: { type: String, default: '' },
    preferredLocation: { type: String, default: '' },
    expectedSalary: { type: String, default: '' },
    availability: { type: String, default: '' },
    workType: { type: String, default: 'remote' }
  }
});

module.exports = mongoose.model('User', UserSchema);