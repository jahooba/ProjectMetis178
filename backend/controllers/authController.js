const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

// Signup Endpoint
const signup = async (req, res) => {
    try{
        const {email, password} = req.body;

        //If email was not entered
        if (!email) {
            return res.status(400).json({ error: "Enter an email"});
        };

        //If password was not entered
        if (!password || password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long"});
        };

        // If already in database
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({ error: "User already exists"});
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create ({
            email, 
            password: hashedPassword,
        })

        return res.status(201).json(user)

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Login Endpoint
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ error: "User not found"});
        }

        const doesExist = await bcrypt.compare(password, user.password);
        if (doesExist) {
            jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    _id: user._id,
                    email: user.email,
                    completedCourses: user.completedCourses || []
                });
            })
            return res.status(200).json({ message: "Login successful" });
        } 

        else {
            return res.status(400).json({ error: "Invalid password" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    login,
    signup
}