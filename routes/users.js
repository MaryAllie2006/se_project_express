const router = require('express').Router();
const { getUsers, createUser, getUser } = require('../controllers/users');

router.get("/", getUsers);
router.get("/:userId", getUser);
router.get("/", createUser);

module.exports = router;
