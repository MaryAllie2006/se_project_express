const router = require('express').Router();
const {getCurrentUser,updateCurrentUser, createUser, login } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);
router.post('/', createUser);
router.post('/signin', login);

module.exports = router;
