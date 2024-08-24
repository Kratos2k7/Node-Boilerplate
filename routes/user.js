const express = require('express');
const { check } = require('express-validator');
const UserController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const router = express.Router();

router.get('/whoami', [
    
], validate, UserController.whoAmI);

router.get('/', UserController.getAllUsers);

router.delete('/:userId', [
    check('userId').isMongoId().withMessage('Invalid user ID'),
], validate, UserController.deleteUser);

router.put('/:userId', [
    check('userId').isMongoId().withMessage('Invalid user ID'),
    check('email').optional().isEmail().withMessage('Enter a valid email address'),
    check('firstName').optional().not().isEmpty().withMessage('Your first name is required'),
    check('lastName').optional().not().isEmpty().withMessage('Your last name is required'),
], validate, UserController.editUserInfo);

module.exports = router;
