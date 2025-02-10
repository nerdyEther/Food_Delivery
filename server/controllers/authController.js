const jwt = require('jsonwebtoken');
const { User } = require('../models/models');


const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

     
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: 'Username already exists'
            });
        }

        const user = new User({
            username,
            password,
            role: role || 'user' 
        });

        await user.save();

      
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

     
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

 
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }


        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

     
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};