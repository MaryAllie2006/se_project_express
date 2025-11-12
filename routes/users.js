const router = require('express').Router();
const {getCurrentUser,updateCurrentUser, createUser, login } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);

module.exports = router;
