const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller.js');

userRouter.get('/allUsers', userController.getAllUsers);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get('/:id', userController.getUserProfile);
userRouter.put('/:id', userController.updateUserProfile);
userRouter.delete('/:id', userController.deleteUserProfile);

module.exports = userRouter;