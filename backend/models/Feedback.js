import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
      {
            canteenId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Canteen',
                  required: true,
                  index: true,
            },
            name: {
                  type: String,
                  trim: true,
            },
            enrollmentNumber: {
                  type: String,
                  required: true,
                  trim: true,
            },
            foodItem: {
                  type: String,
                  required: true,
                  trim: true,
            },
            tasteRating: {
                  type: Number,
                  required: true,
                  min: 1,
                  max: 5,
            },
            cleanlinessRating: {
                  type: Number,
                  required: true,
                  min: 1,
                  max: 5,
            },
            staffBehaviourRating: {
                  type: Number,
                  required: true,
                  min: 1,
                  max: 5,
            },
            comments: {
                  type: String,
                  trim: true,
            },
      },
      { timestamps: true }
);

// High performance compound indexes for tenant queries
feedbackSchema.index({ canteenId: 1, enrollmentNumber: 1, createdAt: -1 });
feedbackSchema.index({ canteenId: 1, createdAt: -1 });
feedbackSchema.index({ canteenId: 1, foodItem: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
