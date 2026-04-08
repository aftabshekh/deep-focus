import express from 'express';
import { startBook, updateBookProgress, getMyBooks } from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/my', getMyBooks);
router.post('/start/:bookId', startBook);
router.put('/progress/:bookId', updateBookProgress);
export default router;