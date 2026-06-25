const express = require('express');
const {
  likeItem,
  dislikeItem,
  createClothingItem,
  deleteClothingItem
} = require('../controllers/clothingItems');
const { validateCardBody, validateItemId } = require('../middlewares/validation');

const router = express.Router();

router.post('/', validateCardBody, createClothingItem);
router.delete('/:itemId', validateItemId, deleteClothingItem);

router.put('/:itemId/likes', validateItemId, likeItem);
router.delete('/:itemId/likes', validateItemId, dislikeItem);

module.exports = router;