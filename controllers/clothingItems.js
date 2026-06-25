const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");
const NotFoundError = require("../utils/NotFoundError");

const createClothingItem = (req, res, next) => {
const { name, weather, imageUrl } = req.body;
const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
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
        return next(new ForbiddenError("Forbidden action"));
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId)
        .then((deletedItem) => res.send(deletedItem));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
};


module.exports = {
  createClothingItem,
  deleteClothingItem,
  getClothingItems,
  likeItem,
  dislikeItem
}
