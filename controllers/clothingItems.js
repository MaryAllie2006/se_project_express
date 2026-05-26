const ClothingItem = require("../models/clothingItem");
const { ERROR_CODE_404, ERROR_CODE_403, ERROR_CODE_500, ERROR_CODE_400 } = require("../utils/errors");

const createClothingItem = (req, res, next) => {
const { name, weather, imageUrl } = req.body;
const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = ERROR_CODE_400;
        return next(error);
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
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

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
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

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => next(err));
};

 const deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        const error = new Error("Forbidden action");
        error.statusCode = ERROR_CODE_403;
        return next(error);
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId)
        .then((deletedItem) => res.send(deletedItem));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
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


module.exports = {
  createClothingItem,
  deleteClothingItem,
  getClothingItems,
  likeItem,
  dislikeItem
}
