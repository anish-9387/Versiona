const mongoose = require('mongoose');
const Repository = require('../models/repository.model');
const User = require('../models/user.model');
const Issue = require('../models/issue.model');

const createRepository = async (req, res) => {
  try {
    const { owner, name, issues, content, description, visibility } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Repository name is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const newRepository = new Repository({
      owner,
      name,
      issues: issues || [],
      content: content || '',
      description: description || '',
      visibility: visibility || 'public',
    });

    const savedRepository = await newRepository.save();

    res.status(201).json({ message: 'Repository created successfully', repository: savedRepository });
  } catch (error) {
    console.error('Error creating repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find()
      .populate("owner")
      .populate("issues");

    res.status(200).json({ repositories });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchRepositoryById = async (req, res) => {
  const repoID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ message: 'Invalid repository ID' });
    }

    const repository = await Repository.findById(repoID)
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    res.status(200).json({ repository });
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchRepositoryByName = async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ message: 'Repository name is required' });
  }

  const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  try {
    const repository = await Repository.findOne({
      name: { $regex: `^${escaped}$`, $options: 'i' }
    })
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    res.status(200).json({ repository });
  } catch (error) {
    console.error('Error fetching repository by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchRepositoriesForCurrentUser = async (req, res) => {
  const userID = req.user;

  try {
    const repositories = await Repository.find({ owner: userID })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ message: "User repositories not found" });
    }

    res.status(200).json({ message: "Repositories found for current user", repositories });
  } catch (error) {
    console.error('Error fetching repositories for current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRepositoryById = async (req, res) => {
  const repoID = req.params.id;
  const { content, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ message: 'Invalid repository ID' });
    }

    const repository = await Repository.findByIdAndUpdate(repoID, { content, description }, { new: true })
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    res.status(200).json({ message: 'Repository updated successfully', repository });
  } catch (error) {
    console.error('Error updating repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRepositoryById = async (req, res) => {
  const repoID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ message: 'Invalid repository ID' });
    }

    const repository = await Repository.findByIdAndDelete(repoID);

    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    res.status(200).json({ message: 'Repository deleted successfully' });
  } catch (error) {
    console.error('Error deleting repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const toggleVisibilityById = async (req, res) => {
  const repoID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ message: 'Invalid repository ID' });
    }

    const repository = await Repository.findById(repoID);

    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    repository.visibility = !repository.visibility;
    await repository.save();

    res.status(200).json({ message: 'Repository visibility toggled successfully' });
  } catch (error) {
    console.error('Error toggling repository visibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};