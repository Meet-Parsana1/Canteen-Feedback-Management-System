import express from 'express';
const router = express.Router();
import protect from '../middleware/authMiddleware.js';
import Feedback from '../models/Feedback.js';

router.get('/', protect, async (req, res) => {
      try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;


            const { food, startDate, endDate } = req.query;

            let filter = {};

            if (food) filter.foodItem = food;

            if (startDate && endDate) {
                  filter.createdAt = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                  };
            }

            const total = await Feedback.countDocuments(filter);

            const feedback = await Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

            res.json({
                  data: feedback,
                  total,
                  page,
                  pages: Math.ceil(total / limit),
            });
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
});

router.get('/analytics', async (req, res) => {
      try {
            const feedback = await Feedback.find().select(
                  'foodItem tasteRating cleanlinessRating staffBehaviourRating createdAt',
            );

            res.json(feedback);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
});

router.post('/', async (req, res) => {
      try {
            console.log('Incoming Data:', req.body);

            const { enrollmentNumber } = req.body;

            // Find latest feedback from this student
            const lastFeedback = await Feedback.findOne({ enrollmentNumber }).sort({ createdAt: -1 });

            if (lastFeedback) {
                  const lastSubmittedTime = new Date(lastFeedback.createdAt);

                  // Add 24 hours
                  const nextAllowedAt = new Date(lastSubmittedTime.getTime() + 24 * 60 * 60 * 1000);

                  const now = new Date();

                  if (now < nextAllowedAt) {
                        return res.status(400).json({
                              message: 'You can submit feedback again after 24 hours.',
                              nextAllowedAt,
                        });
                  }
            }

            // Save feedback
            const newFeedback = new Feedback(req.body);

            await newFeedback.save();

            res.status(201).json({
                  message: 'Feedback submitted successfully',
            });
      } catch (error) {
            console.log('ERROR:', error.message);

            res.status(500).json({
                  error: error.message,
            });
      }
});

router.delete('/:id', protect, async (req, res) => {
      try {
            await Feedback.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted successfully' });
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
});

export default router;
