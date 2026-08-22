import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Canteen from '../models/Canteen.js';

const protect = async (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required. No token provided.' });
      }

      const token = authHeader.split(' ')[1];

      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded || !decoded.id) {
                  return res.status(401).json({ message: 'Invalid authentication token.' });
            }

            const admin = await Admin.findById(decoded.id).populate('canteenId');

            if (!admin) {
                  return res.status(401).json({ message: 'Admin account not found.' });
            }

            if (!admin.isActive) {
                  return res.status(403).json({ message: 'Admin account has been deactivated.' });
            }

            if (!admin.canteenId) {
                  return res.status(403).json({ message: 'Admin is not associated with any canteen.' });
            }

            req.admin = admin;
            req.canteen = admin.canteenId;

            next();
      } catch (error) {
            return res.status(401).json({ message: 'Session expired or invalid token.' });
      }
};

export default protect;
