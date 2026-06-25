require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');
const { getClothingItems } = require('./controllers/clothingItems');
const auth = require('./middlewares/auth');
const { validateLogin, validateUserBody } = require('./middlewares/validation');

const mainRouter = require("./routes/index");
const errorHandler = require('./middlewares/err-handler');

const {requestLogger, errorLogger} = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateUserBody, createUser);
app.get('/items', getClothingItems);

app.use(auth);
app.use("/", mainRouter);

app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
