const express = require('express');
const issueController = require('../controllers/issue.controller.js');

const issueRouter = express.Router();

issueRouter.post('/', issueController.createIssue);
issueRouter.put('/:id', issueController.updateIssueByID);
issueRouter.delete('/:id', issueController.deleteIssueByID);
issueRouter.get('/all', issueController.getAllIssues);
issueRouter.get('/:id', issueController.getIssueByID);

module.exports = issueRouter;