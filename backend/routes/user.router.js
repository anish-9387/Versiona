const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller.js');

userRouter.get('/allUsers', userController.getAllUsers);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get('/profile', userController.getUserProfile);
userRouter.put('/profile', userController.updateUserProfile);
userRouter.delete('/profile', userController.deleteUserProfile);

module.exports = userRouter;