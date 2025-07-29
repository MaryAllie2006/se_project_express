const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js');

const { PORT = 3001 } = process.env;
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');


app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('hello again');
});

