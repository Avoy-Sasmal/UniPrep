import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateTokens } from '../utils/generateToken.js';

const formatUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  university: user.university,
  college: user.college,
  branch: user.branch,
  semester: user.semester
});

const issueTokens = async (user) => {
  const tokens = generateTokens({ userId: user._id });
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return tokens;
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, university, college, branch, semester } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      university,
      college,
      branch,
      semester
    });

    await user.save();
    const tokens = await issueTokens(user);

    res.status(201).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = await issueTokens(user);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (user.refreshToken !== req.refreshToken) {
      return res.status(403).json({ message: 'Refresh token mismatch' });
    }

    const tokens = await issueTokens(user);
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

