const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');

module.exports.registerUser = async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {fullName, email, password} = req.body;
    const hashedPassword = await userModel.hashPassword(password);
    try {
        const user = await userService.createUser({
            firstName:fullName.firstName,
            lastName:fullName.lastName,
            email,
            password: hashedPassword
        });
         const token = await user.generateAuthToken();
        return res.status(201).json({
            message: 'User created successfully',
            user , token
        });
    } catch (error) {
        return next(error);
    }

}