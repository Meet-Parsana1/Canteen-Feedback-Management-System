import { Link } from 'react-router-dom';
import {
      FaExclamationTriangle,
      FaBan,
      FaClock,
      FaSearch,
      FaHome,
      FaEye,
      FaUtensils,
} from 'react-icons/fa';

export default function FeedbackUnavailable({
      code = 'DEFAULT',
      message,
      canteenName,
      institution,
}) {
      const getStatusDetails = () => {
            switch (code) {
                  case 'CANTEEN_NOT_FOUND':
                        return {
                              icon: <FaSearch className="text-amber-500 text-4xl" />,
                              badgeColor: 'bg-amber-50 border-amber-200 text-amber-700',
                              badgeText: 'Canteen Not Found',
                              title: 'Canteen Not Found',
                              description:
                                    message ||
                                    'We could not find a dining hall associated with this link. Please verify the URL or scan the QR code posted at your campus dining table.',
                        };
                  case 'CANTEEN_PENDING':
                        return {
                              icon: <FaClock className="text-blue-500 text-4xl" />,
                              badgeColor: 'bg-blue-50 border-blue-200 text-blue-700',
                              badgeText: 'Setup In Progress',
                              title: 'Canteen Setup in Progress',
                              description:
                                    message ||
                                    'This canteen is currently setting up its feedback system and is not yet accepting student submissions. Please check back soon!',
                        };
                  case 'CANTEEN_SUSPENDED':
                        return {
                              icon: <FaBan className="text-rose-500 text-4xl" />,
                              badgeColor: 'bg-rose-50 border-rose-200 text-rose-700',
                              badgeText: 'Temporarily Suspended',
                              title: 'Feedback Temporarily Unavailable',
                              description:
                                    message ||
                                    'Feedback collection for this canteen has been temporarily paused by dining administration. Please try again later.',
                        };
                  case 'FEEDBACK_DISABLED':
                        return {
                              icon: <FaClock className="text-slate-500 text-4xl" />,
                              badgeColor: 'bg-slate-100 border-slate-300 text-slate-700',
                              badgeText: 'Feedback Closed',
                              title: 'Submissions Closed',
                              description:
                                    message ||
                                    'This canteen is currently not accepting new feedback responses (e.g. outside dining hours or during kitchen maintenance).',
                        };
                  default:
                        return {
                              icon: <FaExclamationTriangle className="text-rose-500 text-4xl" />,
                              badgeColor: 'bg-rose-50 border-rose-200 text-rose-700',
                              badgeText: 'Unavailable',
                              title: 'Feedback Unavailable',
                              description:
                                    message ||
                                    'This canteen is currently not accepting feedback. Please scan the QR code provided at your canteen or try again later.',
                        };
            }
      };

      const { icon, badgeColor, badgeText, title, description } = getStatusDetails();

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 py-8">
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center border border-slate-200/90 overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

                        {/* Top Badge */}
                        <div className="flex justify-center mb-6">
                              <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeColor}`}
                              >
                                    <span className="w-2 h-2 rounded-full bg-current opacity-75 animate-ping" />
                                    {badgeText}
                              </span>
                        </div>

                        {/* Icon */}
                        <div className="flex justify-center mb-5">
                              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
                                    {icon}
                              </div>
                        </div>

                        {/* Canteen Context if available */}
                        {canteenName && (
                              <div className="mb-3">
                                    <h3 className="text-base font-bold text-teal-700 flex items-center justify-center gap-2">
                                          <FaUtensils className="text-xs" /> {canteenName}
                                    </h3>
                                    {institution && (
                                          <p className="text-xs text-slate-400 font-medium">{institution}</p>
                                    )}
                              </div>
                        )}

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                              {title}
                        </h1>

                        {/* Description */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                              {description}
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                              <Link
                                    to="/demo/student"
                                    className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3 px-5 rounded-xl shadow-md transition-all font-semibold text-sm hover:-translate-y-0.5"
                              >
                                    <FaEye className="text-sm" />
                                    <span>Explore Interactive Student Demo</span>
                              </Link>

                              <Link
                                    to="/"
                                    className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 px-5 rounded-xl transition-all font-semibold text-sm"
                              >
                                    <FaHome className="text-slate-500 text-sm" />
                                    <span>Back to Home</span>
                              </Link>
                        </div>

                        <p className="text-[11px] text-slate-400 font-medium mt-6">
                              Powered by CanteenIQ Multi-Tenant Platform
                        </p>
                  </div>
            </div>
      );
}
