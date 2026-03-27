import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ADMIN SIGNUP
export const signupAdmin = async (req, res) => {
      try {
            const { name, email, password } = req.body;

            const existingAdmin = await Admin.findOne({ email });

            if (existingAdmin) {
                  return res.status(400).json({ message: 'Admin already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new Admin({
                  name,
                  email,
                  password: hashedPassword,
            });

            await newAdmin.save();

            res.status(201).json({
                  message: 'Admin created successfully',
            });
      } catch (error) {
            res.status(500).json({
                  error: error.message,
            });
      }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
      try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email });

            if (!admin) {
                  return res.status(400).json({ message: 'Admin not found' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                  return res.status(400).json({ message: 'Invalid password' });
            }

            // Generate JWT
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

            res.json({
                  message: 'Login successful',
                  token,
                  admin: {
                        id: admin._id,
                        name: admin.name,
                        email: admin.email,
                  },
            });
      } catch (error) {
            res.status(500).json({
                  error: error.message,
            });
      }
};
