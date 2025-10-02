const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validator:{
      validator(value){
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    }
  },
  email: {
    type: string,
    required: true,
    unique: true
  },
  password: {
    type:string,
    required: true,
    select: false
  }
});

module.exports = mongoose.model('user', userSchema);