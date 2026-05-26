const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');
const { getClothingItems } = require('./controllers/clothingItems');
const auth = require('./middlewares/auth');

const mainRouter = require("./routes/index");
const errorHandler = require('./middlewares/err-handler');

const {requestLogger, errorLogger} = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/items', getClothingItems);

app.use(auth);
app.use("/", mainRouter);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler); 