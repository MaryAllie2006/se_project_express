const User = require("../models/user");
const bcrypt = require('bcrypt');
const {ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_409} = require("../utils/errors");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../utils/config');

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
  .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
  .catch((err) => {
    console.error(err);
    if(err.code === 11000) {
      return res.status(ERROR_CODE_409).send({ message: "This email address is already registered." });
      }

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid data" });
      }

      return res.status(ERROR_CODE_500).send({ message: "An error has occurred on the server." });
    });

};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(ERROR_CODE_500).send({ message: "Requested resource not found" });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid ID format" });
      }
      return res.status(ERROR_CODE_500).send({ message: "Requested resource not found" });
    });
};

const login = (req, res) => {
  const {email, password} = req.body;

  User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Incorrect email or password' });
    });
  };

  const updateCurrentUser = (req, res) => {
    const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid ID format" });
      }
      return res.status(ERROR_CODE_500).send({ message: "An error has occurred on the server" });
    });
  }
module.exports = { getCurrentUser, updateCurrentUser, createUser, getUsers, login};
