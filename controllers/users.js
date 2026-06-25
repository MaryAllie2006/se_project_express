const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");
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
      return next(new ConflictError("This email address is already registered."));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }

    return next(err);
  });

};


const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password."));
      }
      return next(err);
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
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
  }
module.exports = { getCurrentUser, updateCurrentUser, createUser, login};