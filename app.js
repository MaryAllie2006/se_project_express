const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.error(`App listening on port ${PORT}`);
});

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/items', getClothingItems);

app.use(auth);

app.use('/users', userRouter);
app.use('/items', clothingItemsRouter);

