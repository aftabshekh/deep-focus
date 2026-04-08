import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateAccessToken  = (id) => jwt.sign({ id }, process.env.JWT_ACCESS_SECRET,  { expiresIn: '15m' });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('All fields required'); }
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({ name, email, password });
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken  = refreshToken;
  await user.save();
  setRefreshCookie(res, refreshToken);
  const safeUser = user.toJSON();
  res.status(201).json({ user: safeUser, accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken  = refreshToken;
  await user.save();
  setRefreshCookie(res, refreshToken);
  const safeUser = user.toJSON();
  res.json({ user: safeUser, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) { res.status(401); throw new Error('No refresh token'); }
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user    = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) { res.status(403); throw new Error('Invalid refresh token'); }
  res.json({ accessToken: generateAccessToken(user._id) });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) { user.refreshToken = null; await user.save(); }
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => res.json(req.user));