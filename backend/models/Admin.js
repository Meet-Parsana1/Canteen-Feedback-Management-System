import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: true,
                  trim: true,
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
                  trim: true,
                  index: true,
            },
            password: {
                  type: String,
                  required: true,
            },
            canteenId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Canteen',
                  required: true,
                  index: true,
            },
            role: {
                  type: String,
                  enum: ['owner', 'manager'],
                  default: 'owner',
            },
            isActive: {
                  type: Boolean,
                  default: true,
            },
      },
      { timestamps: true }
);

adminSchema.index({ email: 1, canteenId: 1 });

export default mongoose.model('Admin', adminSchema);
