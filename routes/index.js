const router = require("express").Router();
const { ERROR_CODE_404 } = require("../utils/errors");


router.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: "Requested resource not found" });
});

module.exports = router;