import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
      {
            canteenId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Canteen',
                  required: true,
                  index: true,
            },
            email: {
                  type: String,
                  required: true,
                  lowercase: true,
                  trim: true,
            },
            role: {
                  type: String,
                  enum: ['manager', 'owner'],
                  default: 'manager',
            },
            token: {
                  type: String,
                  required: true,
                  unique: true,
                  index: true,
            },
            expiresAt: {
                  type: Date,
                  required: true,
            },
            used: {
                  type: Boolean,
                  default: false,
            },
      },
      { timestamps: true }
);

invitationSchema.index({ email: 1, canteenId: 1 });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
