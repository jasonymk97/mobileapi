const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userModel = require('../models/userModel');

router.post('/register', async (req, res) => {
    try {
        const {email, password, username} = req.body;

        // validation
        const schema = Joi.object({
            email: Joi.string().email().required(),
            username: Joi.string().min(6).required(),
            password: Joi.string().min(6).required(),
        });

        const validateResult = schema.validate({
            email,
            password,
            username
          });

        if (validateResult.error) {
            res.status(200).json({
                error: true,
                message: "inputs are not valid"
            })
            return;
        }

        // check if email already exists
        const user = await userModel.checkUser(email);

        if (user) {
            res.status(200).json({
                error: true,
                message: "email already exists"
            })
            return;
        }
        
        // register
        await userModel.register(email, password, username);

        res.json({
            message: 'account is created successfully'
        });
    } catch (error) {
        res.json({ 
            error: true, 
            message: 'Sever Error' 
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // validation
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        const validateResult = schema.validate({
            email,
            password,
          });

        if (validateResult.error) {
            res.status(200).json({
                error: true,
                message: "email and password should be provided"
            })
            return;
        }

        // check if email already exists
        const user = await userModel.checkUser(email);

        if (!user) {
            res.status(200).json({
                error: true,
                message: "email does not exist"
            })
            return;
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(200).json({
                error: true,
                message: "password is incorrect"
            })
            return;
        }
        
        // create JWT token
        const secretKey = process.env.JWT_SECRET;
        const expiresIn = 60 * 60 * 24; // 1 Day
        const exp =  Date.now() + expiresIn * 1000;
        const token = jwt.sign({email, exp}, secretKey);

        res.json({
            token_type: 'Bearer',
            token,
            expires_in: expiresIn
        });
    } catch (error) {
        res.json({ 
            error: true, 
            message: 'Sever Error' 
        });
    }
});

module.exports = router;
