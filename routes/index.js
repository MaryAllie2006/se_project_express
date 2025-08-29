const router = require("express").Router();
const { ERROR_CODE_404 } = require("../utils/errors");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: "Requested resource not found" });
});

module.exports = router;