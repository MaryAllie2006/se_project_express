const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports = {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500
};


const { ERROR_CODE_400, ERROR_CODE_500 } = require("../utils/errors");

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      console.error(err);

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({
          message: "Invalid data"
        });
      } else {
        return res.status(ERROR_CODE_500).send({
          message: "An error has occurred on the server"
        });
      }
    });
};

ClothingItem.findById(id)
  .orFail()
  .then((item) => {
    res.send(item); 
  })
  .catch((error) => {
    console.error(error);
    if (error.name === 'DocumentNotFoundError') {
      return res.status(ERROR_CODE_404).send({
        message: "Item not found"
      });
    }
    return res.status(ERROR_CODE_500).send({
      message: "An error has occurred on the server"
    });
  });
