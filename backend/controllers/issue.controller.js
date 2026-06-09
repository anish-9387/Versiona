const mongoose = require('mongoose');
const Issue = require('../models/issue.model.js');

const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const repoID = req.params.repoID;

  try {
    const issue = new Issue({
      title,
      description,
      status: 'open',
      repository: new mongoose.Types.ObjectId(repoID),
    });

    await issue.save();
    res.status(201).json({ message: 'Issue created successfully', issue });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateIssueByID = async (req, res) => {
  const issueID = req.params.id;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(issueID);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();
    res.status(200).json({ message: 'Issue updated successfully', issue });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteIssueByID = async (req, res) => {
  const issueID = req.params.id;

  try {
    const issue = await Issue.findByIdAndDelete(issueID);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllIssues = async (req, res) => {
  const repoID = req.params.repoID;

  try {
    const issues = await Issue.find({ repository: new mongoose.Types.ObjectId(repoID) });

    res.status(200).json({ issues });
  } catch (error) {
    console.error('Error fetching all issues:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getIssueByID = async (req, res) => {
  const issueID = req.params.id;

  try {
    const issue = await Issue.findById(issueID);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ issue });
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createIssue,
  updateIssueByID,
  deleteIssueByID,
  getAllIssues,
  getIssueByID,
};