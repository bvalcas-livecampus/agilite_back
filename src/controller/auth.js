const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserService = require('../service/user');

exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({ 
                error: 'Email, password, and username are required' 
            });
        }

        // Check if user already exists
        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                error: 'User with this email already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userData = {
            email,
            username,
            password: hashedPassword
        };

        const newUser = await UserService.createUser(userData);

        // Generate JWT token
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const token = jwt.sign(
            { 
                id: newUser.id || newUser[0]?.id, 
                email: newUser.email || email,
                username: newUser.username || username
            },
            secret,
            { expiresIn: '24h' }
        );

        // Return user info (without password) and token
        const userResponse = {
            id: newUser.id || newUser[0]?.id,
            email: newUser.email || email,
            username: newUser.username || username
        };

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
            token
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            error: 'Internal server error during registration' 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        // Find user by email
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid email or password' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                username: user.username
            },
            secret,
            { expiresIn: '24h' }
        );

        // Return user info (without password) and token
        const userResponse = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            token
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            error: 'Internal server error during login' 
        });
    }
};

exports.logout = (req, res) => {
    // For JWT-based authentication, logout is typically handled on the client side
    // by removing the token from storage. However, we can provide a response.
    res.status(200).json({ 
        message: 'Logout successful. Please remove the token from client storage.' 
    });
};
