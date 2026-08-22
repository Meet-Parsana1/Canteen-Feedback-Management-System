import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Canteen from '../models/Canteen.js';
import Admin from '../models/Admin.js';
import Feedback from '../models/Feedback.js';

dotenv.config();

async function seed() {
      try {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected.');

            // 1. Ensure default canteen exists
            let canteen = await Canteen.findOne({ slug: 'mu-main-canteen' });

            if (!canteen) {
                  canteen = new Canteen({
                        name: 'MU Main Canteen',
                        institution: 'Marwadi University',
                        location: 'Main Campus Food Court, Block A',
                        slug: 'mu-main-canteen',
                        status: 'active',
                        feedbackEnabled: true,
                  });
                  await canteen.save();
                  console.log('Created default canteen: MU Main Canteen (slug: mu-main-canteen)');
            } else {
                  console.log('Found existing default canteen:', canteen.name);
            }

            // 2. Ensure default demo admin exists
            const adminEmail = 'admin@canteen.iq';
            let admin = await Admin.findOne({ email: adminEmail });

            if (!admin) {
                  const hashedPassword = await bcrypt.hash('Admin@123', 10);
                  admin = new Admin({
                        name: 'Campus Dining Director',
                        email: adminEmail,
                        password: hashedPassword,
                        canteenId: canteen._id,
                        role: 'owner',
                        isActive: true,
                  });
                  await admin.save();
                  console.log(`Created default owner admin: ${adminEmail} (password: Admin@123)`);
            } else {
                  // Ensure admin is linked to canteen
                  if (!admin.canteenId) {
                        admin.canteenId = canteen._id;
                        await admin.save();
                        console.log('Updated existing admin with canteenId.');
                  }
            }

            // 3. Migrate any legacy orphan feedbacks without canteenId to default canteen
            const orphansCount = await Feedback.countDocuments({ canteenId: { $exists: false } });
            if (orphansCount > 0) {
                  console.log(`Migrating ${orphansCount} legacy orphan feedback records to default canteen...`);
                  await Feedback.updateMany(
                        { canteenId: { $exists: false } },
                        { $set: { canteenId: canteen._id } }
                  );
                  console.log('Legacy migration completed.');
            }

            console.log('\n--- Seed & Migration Completed Successfully ---');
            console.log('Default Canteen Slug: mu-main-canteen');
            console.log('Default Feedback URL: http://localhost:5173/feedback/mu-main-canteen');
            console.log('Default Admin Login:  admin@canteen.iq / Admin@123');

            process.exit(0);
      } catch (err) {
            console.error('Seed error:', err);
            process.exit(1);
      }
}

seed();
