import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// ------------------------
// Register
// ------------------------
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ message: 'Full name, email, and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await User.create({ fullName, email, passwordHash });

    const { accessToken, refreshToken } = generateTokens(newUser.id);
    await User.updateRefreshToken(newUser.id, refreshToken);

    res.status(201).json({ message: 'User registered successfully', user: newUser, accessToken, refreshToken });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------------
// Login
// ------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

    const { accessToken, refreshToken } = generateTokens(user.id);
    await User.updateRefreshToken(user.id, refreshToken);

    const { password_hash, refresh_token, ...userWithoutPassword } = user;

    res.json({ message: 'Login successful', user: userWithoutPassword, accessToken, refreshToken });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------------
// Logout
// ------------------------
export const logout = async (req, res) => {
  try {
    await User.updateRefreshToken(req.user.id, null);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------------
// Refresh token
// ------------------------
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    await User.updateRefreshToken(user.id, newRefreshToken);

    res.json({ accessToken, refreshToken: newRefreshToken });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
