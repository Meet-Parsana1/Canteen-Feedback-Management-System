import mongoose from 'mongoose';
import crypto from 'crypto';

const canteenSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, 'Canteen name is required'],
                  trim: true,
            },
            institution: {
                  type: String,
                  trim: true,
                  default: 'Campus Dining',
            },
            location: {
                  type: String,
                  trim: true,
                  default: 'Main Campus',
            },
            slug: {
                  type: String,
                  required: [true, 'Slug is required'],
                  unique: true,
                  lowercase: true,
                  trim: true,
                  index: true,
            },
            status: {
                  type: String,
                  enum: ['pending', 'active', 'suspended'],
                  default: 'active',
                  index: true,
            },
            feedbackEnabled: {
                  type: Boolean,
                  default: true,
            },
            qrToken: {
                  type: String,
                  unique: true,
                  index: true,
                  default: () => crypto.randomBytes(16).toString('hex'),
            },
      },
      { timestamps: true }
);

canteenSchema.index({ slug: 1, status: 1 });

const Canteen = mongoose.model('Canteen', canteenSchema);

export default Canteen;
