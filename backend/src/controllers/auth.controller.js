const bcrypt = require('bcryptjs');
const { User } = require('../models');

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role: 'cashier', // default role
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Account created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: trimmedEmail } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }
    }

    return res.status(400).json({ message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
};
