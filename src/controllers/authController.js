const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { JWT_SECRET } = process.env;

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
  
      // Check if email already exists
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
  
   
      const existingUsername = await userModel.findUserByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ error: 'Username already exists' });
      }
  
      const userId = await userModel.createUser(username, email, password);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ message: 'If the email exists, a reset link has been sent' });
      }
  
      // Here you would typically send an email with reset token
      // For now, just return success
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: 'None', // Allows cross-origin cookie (e.g. Vercel ↔ Railway)
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
      });
      
      
      res.json({ 
        message: 'Login successful',
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  getProfile: async (req, res) => {
    try {
      const user = await userModel.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  

      res.json({
        id: user.id,
        username: user.username,
        email: user.email
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ,

  logout: (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  },

  getCurrentUser: (req, res) => {
    res.json({ userId: req.userId });
  }
};
