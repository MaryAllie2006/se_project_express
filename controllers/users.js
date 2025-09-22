const User = require("../models/user");
const {ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid data" });
      }
      return res.status(ERROR_CODE_500).send({ message: "Requested resource not found" });
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

const getUser = (req, res) => {
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

module.exports = { getUser, createUser, getUsers };
