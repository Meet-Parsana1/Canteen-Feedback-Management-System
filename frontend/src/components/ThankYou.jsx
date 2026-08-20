import { Link } from "react-router-dom";
import { FaCheckCircle, FaUtensils, FaChartBar, FaHome, FaArrowRight } from "react-icons/fa";

function ThankYou() {
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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2.5 tracking-tight">
                              Thank You for Your Feedback!
                        </h1>

                        {/* Message */}
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
                              Your voice helps us improve canteen food taste, cleanliness, and service quality for everyone on campus.
                        </p>

                        {/* Action Buttons with clear hierarchy */}
                        <div className="space-y-3">
                              {/* Primary Action */}
                              <Link
                                    to="/feedback"
                                    className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base font-bold"
                              >
                                    <FaUtensils className="text-sm" />
                                    <span>Submit Another Review</span>
                                    <FaArrowRight className="text-xs ml-0.5 opacity-80" />
                              </Link>

                              {/* Secondary Actions (Side by Side) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <Link
                                          to="/dashboard"
                                          className="inline-flex items-center justify-center gap-2 border border-teal-200/90 bg-teal-50/50 hover:bg-teal-100/70 text-teal-800 py-3 px-4 rounded-xl transition-all font-semibold text-xs sm:text-sm hover:border-teal-300 shadow-sm"
                                    >
                                          <FaChartBar className="text-teal-600 text-sm shrink-0" />
                                          <span className="whitespace-nowrap">View Live Dashboard</span>
                                    </Link>

                                    <Link
                                          to="/"
                                          className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 px-4 rounded-xl transition-all font-semibold text-xs sm:text-sm hover:border-slate-300 shadow-sm"
                                    >
                                          <FaHome className="text-slate-500 text-sm shrink-0" />
                                          <span className="whitespace-nowrap">Back to Home</span>
                                    </Link>
                              </div>
                        </div>

                        {/* Footer Subtext */}
                        <p className="text-[11px] text-slate-400 font-medium mt-6">
                              Powered by CanteenIQ Analytics System
                        </p>

                  </div>
            </div>
      );
}

export default ThankYou;