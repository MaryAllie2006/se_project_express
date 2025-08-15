module.exports.createClothingItems = (req, res, next) => {
  console.log(req.user._id);

  const newItem = {
    name: req.body.name,
    weather: req.body.weather,
    imageUrl: req.body.imageUrl,
    owner: req.user._id,
  };
};

const ClothingItem = require('../models/clothingItem');
const { ERROR_CODE_404, ERROR_CODE_500 } = require('../utils/errors');

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_404).send({ message: 'Item not found' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'An error has occurred on the server' });
    });
};

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_404).send({ message: 'Item not found' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'An error has occurred on the server' });
    });
};
