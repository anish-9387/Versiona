const express = require('express');
const indexRouter = express.Router();

const userRouter = require('./user.router.js');

indexRouter.use('/user', userRouter);

indexRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = indexRouter;