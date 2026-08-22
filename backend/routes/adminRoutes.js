import express from 'express';
import {
      setupAdminAndCanteen,
      loginAdmin,
      getMe,
      inviteManager,
      acceptInvite,
      getCanteenDetails,
      updateCanteenSettings,
      getCanteenTeam,
      getAdminFeedback,
      getAdminAnalytics,
      deleteAdminFeedback,
} from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Auth Endpoints
router.post('/auth/setup', setupAdminAndCanteen);
router.post('/auth/login', loginAdmin);
router.post('/signup', setupAdminAndCanteen); // Backward compatible mapping
router.post('/login', loginAdmin); // Backward compatible mapping
router.post('/auth/accept-invite', acceptInvite);

// Protected Admin Endpoints
router.get('/auth/me', protect, getMe);

// Canteen Settings & Team Management
router.get('/canteen', protect, getCanteenDetails);
router.patch('/canteen/settings', protect, updateCanteenSettings);
router.put('/canteen/settings', protect, updateCanteenSettings);
router.post('/canteen/invite', protect, inviteManager);
router.get('/canteen/team', protect, getCanteenTeam);

// Tenant-Scoped Feedback Operations
router.get('/feedback', protect, getAdminFeedback);
router.get('/feedback/analytics', protect, getAdminAnalytics);
router.delete('/feedback/:id', protect, deleteAdminFeedback);

export default router;
