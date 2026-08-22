import Canteen from '../models/Canteen.js';
import Feedback from '../models/Feedback.js';

// GET /api/canteens/:slug - Public validation & info
export const getCanteenBySlug = async (req, res) => {
      try {
            const { slug } = req.params;
            const normalizedSlug = slug.toLowerCase().trim();

            const canteen = await Canteen.findOne({ slug: normalizedSlug });

            if (!canteen) {
                  return res.status(404).json({
                        success: false,
                        code: 'CANTEEN_NOT_FOUND',
                        message: 'Canteen not found. Please verify the URL or scan a valid canteen QR code.',
                  });
            }

            // Determine accessibility state
            let canAcceptFeedback = true;
            let statusMessage = '';

            if (canteen.status === 'pending') {
                  canAcceptFeedback = false;
                  statusMessage = 'This canteen is currently setting up and not yet accepting feedback.';
            } else if (canteen.status === 'suspended') {
                  canAcceptFeedback = false;
                  statusMessage = 'Feedback collection is temporarily suspended for this canteen.';
            } else if (canteen.status !== 'active') {
                  canAcceptFeedback = false;
                  statusMessage = 'This canteen is not currently accepting feedback.';
            } else if (!canteen.feedbackEnabled) {
                  canAcceptFeedback = false;
                  statusMessage = 'This canteen is currently not accepting new feedback submissions.';
            }

            res.json({
                  success: true,
                  canteen: {
                        id: canteen._id,
                        name: canteen.name,
                        institution: canteen.institution,
                        location: canteen.location,
                        slug: canteen.slug,
                        status: canteen.status,
                        feedbackEnabled: canteen.feedbackEnabled,
                        canAcceptFeedback,
                        statusMessage,
                  },
            });
      } catch (error) {
            console.error('getCanteenBySlug error:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve canteen details.' });
      }
};

// POST /api/canteens/:slug/feedback - Canteen-specific feedback submission
export const submitCanteenFeedback = async (req, res) => {
      try {
            const { slug } = req.params;
            const normalizedSlug = slug.toLowerCase().trim();

            const canteen = await Canteen.findOne({ slug: normalizedSlug });

            if (!canteen) {
                  return res.status(404).json({
                        success: false,
                        code: 'CANTEEN_NOT_FOUND',
                        message: 'Canteen not found. Cannot submit feedback to an invalid canteen.',
                  });
            }

            // Verify canteen is active
            if (canteen.status === 'pending') {
                  return res.status(403).json({
                        success: false,
                        code: 'CANTEEN_PENDING',
                        message: 'This canteen is not yet accepting feedback.',
                  });
            }

            if (canteen.status === 'suspended') {
                  return res.status(403).json({
                        success: false,
                        code: 'CANTEEN_SUSPENDED',
                        message: 'Feedback is temporarily unavailable for this canteen.',
                  });
            }

            if (canteen.status !== 'active') {
                  return res.status(403).json({
                        success: false,
                        code: 'CANTEEN_INACTIVE',
                        message: 'This canteen is not currently accepting feedback.',
                  });
            }

            // Verify feedbackEnabled toggle
            if (!canteen.feedbackEnabled) {
                  return res.status(403).json({
                        success: false,
                        code: 'FEEDBACK_DISABLED',
                        message: 'This canteen is currently not accepting feedback.',
                  });
            }

            const {
                  name,
                  enrollmentNumber,
                  foodItem,
                  tasteRating,
                  cleanlinessRating,
                  staffBehaviourRating,
                  comments,
            } = req.body;

            // Form validation
            if (!enrollmentNumber || !/^\d{11}$/.test(String(enrollmentNumber).trim())) {
                  return res.status(400).json({
                        success: false,
                        message: 'Enrollment number must be exactly 11 digits.',
                  });
            }

            if (!foodItem || !foodItem.trim()) {
                  return res.status(400).json({
                        success: false,
                        message: 'Food item selection is required.',
                  });
            }

            const taste = Number(tasteRating);
            const clean = Number(cleanlinessRating);
            const staff = Number(staffBehaviourRating);

            if ([taste, clean, staff].some((r) => isNaN(r) || r < 1 || r > 5)) {
                  return res.status(400).json({
                        success: false,
                        message: 'Ratings must be between 1 and 5 stars.',
                  });
            }

            const trimmedEnrollment = String(enrollmentNumber).trim();

            // 24-hour rate limit scoped strictly to this canteen
            const lastFeedback = await Feedback.findOne({
                  canteenId: canteen._id,
                  enrollmentNumber: trimmedEnrollment,
            }).sort({ createdAt: -1 });

            if (lastFeedback) {
                  const lastSubmittedTime = new Date(lastFeedback.createdAt);
                  const nextAllowedAt = new Date(lastSubmittedTime.getTime() + 24 * 60 * 60 * 1000);
                  const now = new Date();

                  if (now < nextAllowedAt) {
                        return res.status(400).json({
                              success: false,
                              code: 'RATE_LIMITED_24H',
                              message: "You've already submitted feedback for this canteen within the last 24 hours.",
                              nextAllowedAt,
                        });
                  }
            }

            // Create Feedback with authoritative server-attached canteenId
            const newFeedback = new Feedback({
                  canteenId: canteen._id,
                  name: name ? String(name).trim() : '',
                  enrollmentNumber: trimmedEnrollment,
                  foodItem: String(foodItem).trim(),
                  tasteRating: taste,
                  cleanlinessRating: clean,
                  staffBehaviourRating: staff,
                  comments: comments ? String(comments).trim() : '',
            });

            await newFeedback.save();

            res.status(201).json({
                  success: true,
                  message: 'Feedback submitted successfully! Thank you.',
                  canteenName: canteen.name,
            });
      } catch (error) {
            console.error('submitCanteenFeedback error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to record feedback. Please try again.',
            });
      }
};

// GET /api/canteens/:slug/analytics - Canteen-scoped student analytics
export const getCanteenAnalytics = async (req, res) => {
      try {
            const { slug } = req.params;
            const normalizedSlug = slug.toLowerCase().trim();

            const canteen = await Canteen.findOne({ slug: normalizedSlug });

            if (!canteen) {
                  return res.status(404).json({
                        success: false,
                        message: 'Canteen not found.',
                  });
            }

            const feedback = await Feedback.find({ canteenId: canteen._id })
                  .select('foodItem tasteRating cleanlinessRating staffBehaviourRating createdAt')
                  .sort({ createdAt: -1 });

            res.json({
                  success: true,
                  canteen: {
                        name: canteen.name,
                        institution: canteen.institution,
                        slug: canteen.slug,
                  },
                  data: feedback,
            });
      } catch (error) {
            console.error('getCanteenAnalytics error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to load canteen analytics.',
            });
      }
};
