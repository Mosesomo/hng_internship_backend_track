const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { User, Organisation } = require('../models');
const { v4: uuidv4 } = require('uuid');

const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array().map(err => ({ field: err.param, message: err.msg }))});
    }

    const { firstName, lastName, email, password, phone } = req.body;
    try {
        const isUserAvailable = await User.findOne({ where: { email } });
        if (isUserAvailable) {
            return res.status(400).json({ error: "Email already exists!!" });
	}

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
	});
	
    	const orgId = uuidv4();
        const newOrganisation = await Organisation.create({
                orgId,
                name: `${firstName}'s Organisation`,
                description: '',
                userId: newUser.userId
        });
	
	await newUser.addOrganisation(newOrganisation);
        
        const token = jwt.sign({
            userId: newUser.userId
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: {
                    userId: newUser.userId,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                }
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }
});

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(err => ({ field: err.param, message: err.msg })) });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ status: "Bad request", message: "Authentication failed", statusCode: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const token = jwt.sign({
            userId: user.userId
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ status: 'Bad request', message: "Authentication failed", statusCode: 401 });
    }
});

module.exports = {
    register,
    login
};
