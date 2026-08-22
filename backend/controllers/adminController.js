import Admin from '../models/Admin.js';
import Canteen from '../models/Canteen.js';
import Invitation from '../models/Invitation.js';
import Feedback from '../models/Feedback.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const slugify = (text) => {
      return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
};

// POST /api/admin/auth/setup - Onboard new Canteen and Owner Admin
export const setupAdminAndCanteen = async (req, res) => {
      try {
            const { name, email, password, canteenName, institution, location, slug } = req.body;

            if (!name || !email || !password || !canteenName) {
                  return res.status(400).json({
                        success: false,
                        message: 'Name, email, password, and canteen name are all required.',
                  });
            }

            const normalizedEmail = email.toLowerCase().trim();
            const existingAdmin = await Admin.findOne({ email: normalizedEmail });

            if (existingAdmin) {
                  return res.status(400).json({
                        success: false,
                        message: 'An administrator account with this email already exists.',
                  });
            }

            // Generate unique slug
            let baseSlug = slugify(slug || canteenName);
            if (!baseSlug) baseSlug = 'canteen';

            let candidateSlug = baseSlug;
            let counter = 1;

            while (await Canteen.findOne({ slug: candidateSlug })) {
                  candidateSlug = `${baseSlug}-${counter}`;
                  counter += 1;
            }

            // Create Canteen
            const newCanteen = new Canteen({
                  name: canteenName.trim(),
                  institution: institution ? institution.trim() : 'Campus Dining',
                  location: location ? location.trim() : 'Main Campus',
                  slug: candidateSlug,
                  status: 'active',
                  feedbackEnabled: true,
            });

            await newCanteen.save();

            // Hash password and create Owner Admin
            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new Admin({
                  name: name.trim(),
                  email: normalizedEmail,
                  password: hashedPassword,
                  canteenId: newCanteen._id,
                  role: 'owner',
                  isActive: true,
            });

            await newAdmin.save();

            // Generate JWT
            const token = jwt.sign(
                  { id: newAdmin._id, canteenId: newCanteen._id },
                  process.env.JWT_SECRET,
                  { expiresIn: '12h' }
            );

            res.status(201).json({
                  success: true,
                  message: 'Canteen and Administrator account created successfully!',
                  token,
                  admin: {
                        id: newAdmin._id,
                        name: newAdmin.name,
                        email: newAdmin.email,
                        role: newAdmin.role,
                  },
                  canteen: {
                        id: newCanteen._id,
                        name: newCanteen.name,
                        institution: newCanteen.institution,
                        location: newCanteen.location,
                        slug: newCanteen.slug,
                        status: newCanteen.status,
                        feedbackEnabled: newCanteen.feedbackEnabled,
                  },
            });
      } catch (error) {
            console.error('setupAdminAndCanteen error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// POST /api/admin/auth/login - Admin Login
export const loginAdmin = async (req, res) => {
      try {
            const { email, password } = req.body;

            if (!email || !password) {
                  return res.status(400).json({
                        success: false,
                        message: 'Email and password are required.',
                  });
            }

            const normalizedEmail = email.toLowerCase().trim();
            const admin = await Admin.findOne({ email: normalizedEmail }).populate('canteenId');

            if (!admin) {
                  return res.status(400).json({
                        success: false,
                        message: 'Invalid email or password.',
                  });
            }

            if (!admin.isActive) {
                  return res.status(403).json({
                        success: false,
                        message: 'This administrator account has been deactivated.',
                  });
            }

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                  return res.status(400).json({
                        success: false,
                        message: 'Invalid email or password.',
                  });
            }

            const canteen = admin.canteenId;

            if (!canteen) {
                  return res.status(403).json({
                        success: false,
                        message: 'No associated canteen found for this account.',
                  });
            }

            // Generate JWT
            const token = jwt.sign(
                  { id: admin._id, canteenId: canteen._id },
                  process.env.JWT_SECRET,
                  { expiresIn: '12h' }
            );

            res.json({
                  success: true,
                  message: 'Login successful',
                  token,
                  admin: {
                        id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                  },
                  canteen: {
                        id: canteen._id,
                        name: canteen.name,
                        institution: canteen.institution,
                        location: canteen.location,
                        slug: canteen.slug,
                        status: canteen.status,
                        feedbackEnabled: canteen.feedbackEnabled,
                  },
            });
      } catch (error) {
            console.error('loginAdmin error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// GET /api/admin/auth/me - Validate token and get current admin & canteen profile
export const getMe = async (req, res) => {
      try {
            res.json({
                  success: true,
                  admin: {
                        id: req.admin._id,
                        name: req.admin.name,
                        email: req.admin.email,
                        role: req.admin.role,
                  },
                  canteen: {
                        id: req.canteen._id,
                        name: req.canteen.name,
                        institution: req.canteen.institution,
                        location: req.canteen.location,
                        slug: req.canteen.slug,
                        status: req.canteen.status,
                        feedbackEnabled: req.canteen.feedbackEnabled,
                        qrToken: req.canteen.qrToken,
                  },
            });
      } catch (error) {
            console.error('getMe error:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
      }
};

// POST /api/admin/canteen/invite - Owner generates invitation for manager
export const inviteManager = async (req, res) => {
      try {
            if (req.admin.role !== 'owner') {
                  return res.status(403).json({
                        success: false,
                        message: 'Only the canteen owner can invite new managers.',
                  });
            }

            const { email, role = 'manager' } = req.body;

            if (!email) {
                  return res.status(400).json({
                        success: false,
                        message: 'Email address is required.',
                  });
            }

            const normalizedEmail = email.toLowerCase().trim();

            const existingAdmin = await Admin.findOne({ email: normalizedEmail });
            if (existingAdmin) {
                  return res.status(400).json({
                        success: false,
                        message: 'An administrator with this email already exists in the system.',
                  });
            }

            // Invalidate any existing unused invitations for this email + canteen
            await Invitation.deleteMany({
                  email: normalizedEmail,
                  canteenId: req.admin.canteenId,
            });

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            const invitation = new Invitation({
                  canteenId: req.admin.canteenId,
                  email: normalizedEmail,
                  role: role === 'owner' ? 'owner' : 'manager',
                  token,
                  expiresAt,
            });

            await invitation.save();

            res.status(201).json({
                  success: true,
                  message: `Invitation generated for ${normalizedEmail}`,
                  invitation: {
                        email: invitation.email,
                        token: invitation.token,
                        role: invitation.role,
                        expiresAt: invitation.expiresAt,
                  },
            });
      } catch (error) {
            console.error('inviteManager error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// POST /api/admin/auth/accept-invite - Manager accepts invite
export const acceptInvite = async (req, res) => {
      try {
            const { token, name, password } = req.body;

            if (!token || !name || !password) {
                  return res.status(400).json({
                        success: false,
                        message: 'Token, name, and password are required.',
                  });
            }

            const invitation = await Invitation.findOne({ token, used: false }).populate('canteenId');

            if (!invitation) {
                  return res.status(400).json({
                        success: false,
                        message: 'Invalid or already used invitation link.',
                  });
            }

            if (new Date() > new Date(invitation.expiresAt)) {
                  return res.status(400).json({
                        success: false,
                        message: 'This invitation link has expired.',
                  });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new Admin({
                  name: name.trim(),
                  email: invitation.email,
                  password: hashedPassword,
                  canteenId: invitation.canteenId._id,
                  role: invitation.role || 'manager',
                  isActive: true,
            });

            await newAdmin.save();

            invitation.used = true;
            await invitation.save();

            const jwtToken = jwt.sign(
                  { id: newAdmin._id, canteenId: invitation.canteenId._id },
                  process.env.JWT_SECRET,
                  { expiresIn: '12h' }
            );

            res.status(201).json({
                  success: true,
                  message: 'Account setup complete! Welcome to CanteenIQ.',
                  token: jwtToken,
                  admin: {
                        id: newAdmin._id,
                        name: newAdmin.name,
                        email: newAdmin.email,
                        role: newAdmin.role,
                  },
                  canteen: {
                        id: invitation.canteenId._id,
                        name: invitation.canteenId.name,
                        slug: invitation.canteenId.slug,
                  },
            });
      } catch (error) {
            console.error('acceptInvite error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// GET /api/admin/canteen - Retrieve Canteen Details
export const getCanteenDetails = async (req, res) => {
      try {
            const canteen = await Canteen.findById(req.admin.canteenId);

            if (!canteen) {
                  return res.status(404).json({ success: false, message: 'Canteen not found.' });
            }

            res.json({
                  success: true,
                  canteen,
            });
      } catch (error) {
            console.error('getCanteenDetails error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// PATCH /api/admin/canteen/settings - Update Canteen Settings
export const updateCanteenSettings = async (req, res) => {
      try {
            const { name, institution, location, feedbackEnabled, status } = req.body;
            const updateFields = {};

            if (typeof feedbackEnabled === 'boolean') {
                  updateFields.feedbackEnabled = feedbackEnabled;
            }

            if (name && name.trim()) {
                  updateFields.name = name.trim();
            }

            if (institution && institution.trim()) {
                  updateFields.institution = institution.trim();
            }

            if (location && location.trim()) {
                  updateFields.location = location.trim();
            }

            // Only owner can update status (active / suspended)
            if (status && ['active', 'suspended', 'pending'].includes(status)) {
                  if (req.admin.role === 'owner') {
                        updateFields.status = status;
                  }
            }

            const updatedCanteen = await Canteen.findByIdAndUpdate(
                  req.admin.canteenId,
                  { $set: updateFields },
                  { new: true }
            );

            res.json({
                  success: true,
                  message: 'Canteen settings updated successfully.',
                  canteen: updatedCanteen,
            });
      } catch (error) {
            console.error('updateCanteenSettings error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// GET /api/admin/canteen/team - List team members
export const getCanteenTeam = async (req, res) => {
      try {
            const team = await Admin.find({ canteenId: req.admin.canteenId })
                  .select('name email role isActive createdAt')
                  .sort({ role: -1, createdAt: 1 });

            res.json({
                  success: true,
                  team,
            });
      } catch (error) {
            console.error('getCanteenTeam error:', error);
            res.status(500).json({ success: false, message: error.message });
      }
};

// GET /api/admin/feedback - Strictly Tenant-Scoped Feedback Retrieval
export const getAdminFeedback = async (req, res) => {
      try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const { food, startDate, endDate, search } = req.query;

            // Strict tenant isolation: req.admin.canteenId is authoritative
            let filter = { canteenId: req.admin.canteenId };

            if (food && food !== 'all') {
                  filter.foodItem = food;
            }

            if (startDate || endDate) {
                  filter.createdAt = {};
                  if (startDate) filter.createdAt.$gte = new Date(startDate);
                  if (endDate) filter.createdAt.$lte = new Date(endDate);
            }

            if (search && search.trim()) {
                  const searchRegex = new RegExp(search.trim(), 'i');
                  filter.$or = [
                        { enrollmentNumber: searchRegex },
                        { foodItem: searchRegex },
                        { name: searchRegex },
                        { comments: searchRegex },
                  ];
            }

            const total = await Feedback.countDocuments(filter);
            const feedback = await Feedback.find(filter)
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit);

            res.json({
                  success: true,
                  data: feedback,
                  total,
                  page,
                  pages: Math.ceil(total / limit) || 1,
            });
      } catch (error) {
            console.error('getAdminFeedback error:', error);
            res.status(500).json({ success: false, error: error.message });
      }
};

// GET /api/admin/feedback/analytics - Strictly Tenant-Scoped Analytics
export const getAdminAnalytics = async (req, res) => {
      try {
            // Strict tenant isolation: req.admin.canteenId is authoritative
            const feedback = await Feedback.find({ canteenId: req.admin.canteenId })
                  .select('foodItem tasteRating cleanlinessRating staffBehaviourRating createdAt comments enrollmentNumber')
                  .sort({ createdAt: -1 });

            res.json(feedback);
      } catch (error) {
            console.error('getAdminAnalytics error:', error);
            res.status(500).json({ success: false, error: error.message });
      }
};

// DELETE /api/admin/feedback/:id - Strictly Tenant-Scoped Deletion
export const deleteAdminFeedback = async (req, res) => {
      try {
            const { id } = req.params;

            // Strict tenant isolation: delete only if it belongs to current admin's canteen
            const deleted = await Feedback.findOneAndDelete({
                  _id: id,
                  canteenId: req.admin.canteenId,
            });

            if (!deleted) {
                  return res.status(404).json({
                        success: false,
                        message: 'Feedback record not found or access denied.',
                  });
            }

            res.json({
                  success: true,
                  message: 'Feedback record deleted successfully.',
            });
      } catch (error) {
            console.error('deleteAdminFeedback error:', error);
            res.status(500).json({ success: false, error: error.message });
      }
};
