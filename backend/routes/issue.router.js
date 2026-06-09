const express = require('express');
const issueController = require('../controllers/issue.controller.js');

const issueRouter = express.Router();

issueRouter.post('/create/:repoID', issueController.createIssue);
issueRouter.get('/all/:repoID', issueController.getAllIssues);
issueRouter.get('/:id', issueController.getIssueByID);
issueRouter.put('/:id', issueController.updateIssueByID);
issueRouter.delete('/:id', issueController.deleteIssueByID);

module.exports = issueRouter;