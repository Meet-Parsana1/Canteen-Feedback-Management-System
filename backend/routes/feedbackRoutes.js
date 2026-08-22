import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
      getAdminFeedback,
      getAdminAnalytics,
      deleteAdminFeedback,
} from '../controllers/adminController.js';

const router = express.Router();

// Forward authenticated legacy feedback routes to tenant-scoped handlers
router.get('/', protect, getAdminFeedback);
router.get('/analytics', protect, getAdminAnalytics);
router.delete('/:id', protect, deleteAdminFeedback);

// Reject unauthenticated generic submissions and guide client to canteen-specific endpoint
router.post('/', async (_req, res) => {
      return res.status(400).json({
            success: false,
            code: 'CANTEEN_REQUIRED',
            message:
                  'Direct submission without canteen context is not permitted. Please access feedback through your specific canteen link (/feedback/:canteenSlug) or scan the QR code posted at your campus dining hall.',
      });
});

export default router;
