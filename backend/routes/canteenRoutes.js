import express from 'express';
import {
      getCanteenBySlug,
      submitCanteenFeedback,
      getCanteenAnalytics,
} from '../controllers/canteenController.js';

const router = express.Router();

// Public Canteen Routes
router.get('/:slug', getCanteenBySlug);
router.post('/:slug/feedback', submitCanteenFeedback);
router.get('/:slug/analytics', getCanteenAnalytics);

export default router;
