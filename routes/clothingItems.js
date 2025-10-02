const express = require('express');
const {
  likeItem,
  dislikeItem,
  createClothingItem,
  getClothingItems,
  deleteClothingItem
} = require('../controllers/clothingItems');

const router = express.Router();

router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.delete('/:itemId', deleteClothingItem);

router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;