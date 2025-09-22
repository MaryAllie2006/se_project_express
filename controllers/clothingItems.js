const ClothingItem = require("../models/clothingItem");
const { ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_400 } = require("../utils/errors");

 const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid ID format" });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid ID format" });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server" });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(ERROR_CODE_500).send({ message: "An error has occurred on the server" }));
};

 const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid ID format" });
      }
      return res.status(ERROR_CODE_500).send({ message: "An error has occurred on the server" });
    });
};


module.exports = {
  createClothingItem,
  deleteClothingItem,
  getClothingItems,
  likeItem,
  dislikeItem
}
