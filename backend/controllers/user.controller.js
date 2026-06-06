const getAllUsers = (req, res) => {
  res.send('Get all users');
};

const signup = (req, res) => {
  res.send('User signup');
};

const login = (req, res) => {
  res.send('User login');
};

const getUserProfile = (req, res) => {
  res.send('Get user profile');
};

const updateUserProfile = (req, res) => {
  res.send('Update user profile');
};

const deleteUserProfile = (req, res) => {
  res.send('Delete user profile');
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};