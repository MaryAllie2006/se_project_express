const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const {ERROR_CODE_400,ERROR_CODE_401, ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_409} = require("../utils/errors");
const {JWT_SECRET} = require('../utils/config');

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10)
  .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(200).send(userObj);
    })
  .catch((err) => {
    if(err.code === 11000) {
      const error = new Error("This email address is already registered.");
      error.statusCode = ERROR_CODE_409;
      return next(error);
      }

      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = ERROR_CODE_400;
        return next(error);
      }

      next(err);
    });

};


const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const error = new Error("User not found");
        error.statusCode = ERROR_CODE_404;
        return next(error);
      }
      if (err.name === "CastError") {
        const error = new Error("Invalid ID format");
        error.statusCode = ERROR_CODE_400;
        return next(error);
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = ERROR_CODE_400;
    return next(error);
  }

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        const error = new Error("Incorrect email or password.");
        error.statusCode = ERROR_CODE_401;
        return next(error);
      }
      next(err);
    });
  };

  const updateCurrentUser = (req, res, next) => {
    const { name, avatar } = req.body;
   return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const error = new Error("User not found");
        error.statusCode = ERROR_CODE_404;
        return next(error);
      }
      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = ERROR_CODE_400;
        return next(error);
      }
      if (err.name === "CastError") {
        const error = new Error("Invalid ID format");
        error.statusCode = ERROR_CODE_400;
        return next(error);
      }
      next(err);
    });
  }
module.exports = { getCurrentUser, updateCurrentUser, createUser, login};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('User ID not found');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};