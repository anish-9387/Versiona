const createIssue = (req, res) => {
  res.send('Create issue');
};

const updateIssueByID = (req, res) => {
  res.send('Update issue');
};

const deleteIssueByID = (req, res) => {
  res.send('Delete issue');
};

const getAllIssues = (req, res) => {
  res.send('Get all issues');
};

const getIssueByID = (req, res) => {
  res.send('Get issue by ID');
};

module.exports = {
  createIssue,
  updateIssueByID,
  deleteIssueByID,
  getAllIssues,
  getIssueByID,
};