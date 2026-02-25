const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  isAdmin: Joi.boolean().optional()
});

exports.register = async (req, res) => {
  try {
    // 0) Defensive check: ensure req.body exists
    if (!req.body) {
      return res.status(400).json({
        msg: 'Request body is empty. Make sure to send JSON with Content-Type: application/json header.'
      });
    }

    // 1) Validate payload
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    // 2) Ensure JWT secret exists (common cause of 500)
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET is not set on server' });
    }

    // 3) Check existing user
    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ msg: 'User exists' });

    // 4) Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // 5) Save user
    const user = await User.create({
      name: value.name,
      email: value.email,
      password: hashedPassword,
      isAdmin: value.isAdmin || false
    });

    // 6) Sign token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

exports.login = async (req, res) => {
  try {
    // 1) Validate payload
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    // 2) Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET is not set on server' });
    }

    // 3) Find user
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // 4) Compare password
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 5) Sign token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
