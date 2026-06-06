const express = require('express');
const indexRouter = express.Router();

const userRouter = require('./user.router.js');
const repositoryRouter = require('./repository.router.js');
const issueRouter = require('./issue.router.js');

indexRouter.use('/user', userRouter);
indexRouter.use('/repository', repositoryRouter);
indexRouter.use('/issue', issueRouter);

indexRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = indexRouter;