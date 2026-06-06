const express = require('express');
const indexRouter = express.Router();

const userRouter = require('./user.router.js');
const repositoryRouter = require('./repository.router.js');

indexRouter.use('/user', userRouter);
indexRouter.use('/repository', repositoryRouter);

indexRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = indexRouter;