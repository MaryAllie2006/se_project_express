const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const clothingItemsRouter = require('./routes/clothingItems');
const userRouter = require('./routes/users');

const { PORT = 3001 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');
const { getClothingItems } = require('./controllers/clothingItems');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/items', getClothingItems);

app.use(auth);

app.use('/users', userRouter);
app.use('/items', clothingItemsRouter);



app.listen(PORT, () => {
  console.error(`App listening on port ${PORT}`);
});

