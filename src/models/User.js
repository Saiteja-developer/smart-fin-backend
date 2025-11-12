const mongoose = require('mongoose');
//define rules
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  currency: {
    type: String,
    default: 'INR',
  },
}, { timestamps: true });

//use to create a model
module.exports = mongoose.model('User', userSchema);
