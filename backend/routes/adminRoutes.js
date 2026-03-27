import express from 'express';
import { signupAdmin, loginAdmin } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);

// protected route example
router.get('/dashboard', protect, (req, res) => {
      res.json({ message: 'Welcome To Admin Dashboard' });
});

export default router;
