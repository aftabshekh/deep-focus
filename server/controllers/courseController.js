import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const enrollCourse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.enrolledCourses.find(c => c.courseId === req.params.courseId)) {
    res.status(400); throw new Error('Already enrolled');
  }
  user.enrolledCourses.push({ courseId: req.params.courseId });
  await user.save();
  res.status(201).json({ message: 'Enrolled!', enrolledCourses: user.enrolledCourses });
});

export const updateCourseProgress = asyncHandler(async (req, res) => {
  const user   = await User.findById(req.user._id);
  const course = user.enrolledCourses.find(c => c.courseId === req.params.courseId);
  if (!course) { res.status(404); throw new Error('Not enrolled'); }
  course.progress  = req.body.progress;
  course.completed = req.body.progress >= 100;
  await user.save();
  res.json({ message: 'Progress updated', course });
});

export const getMyCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('enrolledCourses');
  res.json(user.enrolledCourses);
});