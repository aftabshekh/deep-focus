import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const startBook = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const existing = user.bookProgress.find(b => b.bookId === req.params.bookId);
  if (existing) return res.json({ message: 'Already started', book: existing });
  user.bookProgress.push({ bookId: req.params.bookId });
  await user.save();
  res.status(201).json({ message: 'Book started', bookProgress: user.bookProgress });
});

export const updateBookProgress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const book = user.bookProgress.find(b => b.bookId === req.params.bookId);
  if (!book) { res.status(404); throw new Error('Book not started'); }
  book.currentChapter = req.body.currentChapter;
  book.lastReadAt     = new Date();
  await user.save();
  res.json({ message: 'Progress updated', book });
});

export const getMyBooks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('bookProgress');
  res.json(user.bookProgress);
});