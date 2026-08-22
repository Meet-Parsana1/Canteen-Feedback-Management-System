import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaUtensils, FaChartBar, FaHome, FaArrowRight, FaEye } from 'react-icons/fa';

function ThankYou() {
      const [searchParams] = useSearchParams();
      const canteenSlug = searchParams.get('canteen') || 'mu-main-canteen';
      const canteenName = searchParams.get('name') || 'Campus Canteen';

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50/80 via-white to-slate-50 p-4 sm:p-6">
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center border border-slate-200/90 overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

                        {/* Top Status Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Feedback Received</span>
                        </div>

                        {/* Success Icon */}
                        <div className="flex justify-center mb-5">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 border border-emerald-200 flex items-center justify-center shadow-inner">
                                    <FaCheckCircle className="text-emerald-500 text-5xl" />
                              </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
                              Thank You for Your Review!
                        </h1>
                        <p className="text-sm font-bold text-teal-700 mb-3">
                              {canteenName}
                        </p>

                        {/* Message */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                              Your ratings on food taste, cleanliness, and staff service have been safely recorded. Canteen administrators use this data to make continuous kitchen improvements.
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                              <Link
                                    to={`/feedback/${canteenSlug}`}
                                    className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-bold"
                              >
                                    <FaUtensils className="text-sm" />
                                    <span>Submit Another Review</span>
                                    <FaArrowRight className="text-xs ml-0.5 opacity-80" />
                              </Link>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <Link
                                          to={`/dashboard/${canteenSlug}`}
                                          className="inline-flex items-center justify-center gap-2 border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 py-3 px-4 rounded-xl transition-all font-semibold text-xs shadow-sm"
                                    >
                                          <FaChartBar className="text-teal-600 text-sm shrink-0" />
                                          <span>View Canteen Analytics</span>
                                    </Link>

                                    <Link
                                          to="/"
                                          className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 px-4 rounded-xl transition-all font-semibold text-xs shadow-sm"
                                    >
                                          <FaHome className="text-slate-500 text-sm shrink-0" />
                                          <span>Back to Home</span>
                                    </Link>
                              </div>
                        </div>

                        {/* Footer Subtext */}
                        <p className="text-[11px] text-slate-400 font-medium mt-6">
                              Powered by CanteenIQ Multi-Canteen Intelligence System
                        </p>
                  </div>
            </div>
      );
}

export default ThankYou;