import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
      {
            name: { type: String },

            enrollmentNumber: { type: String, required: true },

            foodItem: { type: String, required: true },

            tasteRating: { type: Number, required: true },

            cleanlinessRating: { type: Number, required: true },

            staffBehaviourRating: { type: Number, required: true },

            comments: { type: String },
      },
      { timestamps: true },
);


feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ foodItem: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
