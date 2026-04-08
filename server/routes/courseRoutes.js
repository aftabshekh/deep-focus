import express from 'express';
import { enrollCourse, updateCourseProgress, getMyCourses } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/my',                 getMyCourses);
router.post('/enroll/:courseId',  enrollCourse);
router.put('/progress/:courseId', updateCourseProgress);
export default router;