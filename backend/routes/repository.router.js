const express = require('express');
const repositoryController = require('../controllers/repository.controller.js');

const repositoryRouter = express.Router();

repositoryRouter.post('/create', repositoryController.createRepository);
repositoryRouter.get('/all', repositoryController.getAllRepositories);
repositoryRouter.get('/:id', repositoryController.fetchRepositoryById);
repositoryRouter.get('/name/:name', repositoryController.fetchRepositoryByName);
repositoryRouter.get('/user/:userId', repositoryController.fetchRepositoriesForCurrentUser);
repositoryRouter.put('/:id', repositoryController.updateRepositoryById);
repositoryRouter.delete('/:id', repositoryController.deleteRepositoryById);
repositoryRouter.patch('/:id/visibility', repositoryController.toggleVisibilityById);

module.exports = repositoryRouter;