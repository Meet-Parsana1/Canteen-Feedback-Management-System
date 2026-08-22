import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
      FaUtensils,
      FaBuilding,
      FaUserTie,
      FaLock,
      FaEnvelope,
      FaMapMarkerAlt,
      FaArrowRight,
      FaCheckCircle,
} from 'react-icons/fa';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from '../components/CanteenLoader';
import Toast from '../components/Toast';

export default function AdminSetup() {
      const navigate = useNavigate();

      const [step, setStep] = useState(1); // 1: Canteen Info, 2: Owner Credentials
      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null);

      const [canteenForm, setCanteenForm] = useState({
            canteenName: '',
            institution: '',
            location: '',
            slug: '',
      });

      const [ownerForm, setOwnerForm] = useState({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
      });

      const handleCanteenChange = (e) => {
            const { name, value } = e.target;
            let updated = { ...canteenForm, [name]: value };

            if (name === 'canteenName' && !canteenForm.slug) {
                  updated.slug = value
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '');
            }
            setCanteenForm(updated);
      };

      const handleOwnerChange = (e) => {
            setOwnerForm({ ...ownerForm, [e.target.name]: e.target.value });
      };

      const handleNextStep = (e) => {
            e.preventDefault();
            if (!canteenForm.canteenName.trim()) {
                  setToast({ message: 'Canteen / Dining Hall name is required.', type: 'warning' });
                  return;
            }
            setStep(2);
      };

      const handleFinalSetup = async (e) => {
            e.preventDefault();

            if (!ownerForm.name.trim() || !ownerForm.email.trim() || !ownerForm.password) {
                  setToast({ message: 'Please fill in all owner fields.', type: 'warning' });
                  return;
            }

            if (ownerForm.password !== ownerForm.confirmPassword) {
                  setToast({ message: 'Passwords do not match.', type: 'warning' });
                  return;
            }

            if (ownerForm.password.length < 6) {
                  setToast({ message: 'Password must be at least 6 characters long.', type: 'warning' });
                  return;
            }

            setLoading(true);

            try {
                  const res = await fetch(buildApiUrl('/api/admin/auth/setup'), {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                              canteenName: canteenForm.canteenName.trim(),
                              institution: canteenForm.institution.trim() || 'Campus Dining',
                              location: canteenForm.location.trim() || 'Main Hall',
                              slug: canteenForm.slug.trim(),
                              name: ownerForm.name.trim(),
                              email: ownerForm.email.trim(),
                              password: ownerForm.password,
                        }),
                  });

                  const data = await res.json();

                  if (res.ok && data.success) {
                        localStorage.setItem('adminToken', data.token);
                        setToast({
                              message: `Canteen "${data.canteen?.name}" initialized successfully! Loading command center...`,
                              type: 'success',
                        });

                        setTimeout(() => {
                              navigate('/admin');
                        }, 1200);
                  } else {
                        throw new Error(data.message || 'Onboarding failed');
                  }
            } catch (err) {
                  console.error('Setup error:', err);
                  setToast({
                        message: err.message || 'Failed to complete registration.',
                        type: 'error',
                  });
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative">
                  {toast && (
                        <Toast
                              message={toast.message}
                              type={toast.type}
                              onClose={() => setToast(null)}
                        />
                  )}

                  {loading && (
                        <CanteenLoader
                              fullScreen={true}
                              text="Initializing Canteen & Security Boundary..."
                              subtext="Setting up dedicated database workspace, unique QR token & owner authentication..."
                        />
                  )}

                  {/* Left Story Panel */}
                  <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                              <Link to="/" className="inline-flex items-center gap-2 text-teal-400 font-extrabold text-xl mb-10">
                                    <FaUtensils />
                                    <span>Canteen<span className="text-white">IQ</span></span>
                              </Link>

                              <div className="space-y-4 max-w-sm">
                                    <span className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
                                          Canteen Onboarding
                                    </span>
                                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                          Empower your campus dining with intelligent feedback.
                                    </h2>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                          Create your dedicated canteen channel, generate custom QR codes, and gain real-time analytics to drive food quality.
                                    </p>
                              </div>
                        </div>

                        <div className="relative z-10 space-y-3 pt-8 border-t border-slate-800 text-xs text-slate-300">
                              {[
                                    'Strict Tenant Isolation',
                                    'Instant Printable QR Codes',
                                    'Multi-Manager Invitation System',
                                    'Excel & Sentiment Intelligence',
                              ].map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                          <FaCheckCircle className="text-teal-400 shrink-0" />
                                          <span>{item}</span>
                                    </div>
                              ))}
                        </div>
                  </div>

                  {/* Right Form Panel */}
                  <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                        <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-9 max-w-md w-full border border-slate-200/90">
                              {/* Step indicator */}
                              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                    <div>
                                          <span className="text-[11px] font-bold uppercase text-teal-600 tracking-wider">
                                                Step {step} of 2
                                          </span>
                                          <h1 className="text-xl font-extrabold text-slate-900">
                                                {step === 1 ? 'Canteen Profile' : 'Owner Account'}
                                          </h1>
                                    </div>
                                    <div className="flex gap-1.5">
                                          <span className={`w-6 h-2 rounded-full transition-all ${step === 1 ? 'bg-teal-600' : 'bg-teal-200'}`} />
                                          <span className={`w-6 h-2 rounded-full transition-all ${step === 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />
                                    </div>
                              </div>

                              {step === 1 ? (
                                    /* STEP 1: CANTEEN DETAILS */
                                    <form onSubmit={handleNextStep} className="space-y-4">
                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Canteen / Dining Hall Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                      <FaUtensils className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="text"
                                                            name="canteenName"
                                                            placeholder="e.g. MU Main Canteen"
                                                            value={canteenForm.canteenName}
                                                            onChange={handleCanteenChange}
                                                            required
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Institution / University / Company
                                                </label>
                                                <div className="relative">
                                                      <FaBuilding className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="text"
                                                            name="institution"
                                                            placeholder="e.g. Marwadi University"
                                                            value={canteenForm.institution}
                                                            onChange={handleCanteenChange}
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Campus Location / Building
                                                </label>
                                                <div className="relative">
                                                      <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="text"
                                                            name="location"
                                                            placeholder="e.g. Block A, Food Court Level 1"
                                                            value={canteenForm.location}
                                                            onChange={handleCanteenChange}
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Feedback URL Slug <span className="text-slate-400 font-normal">(Auto-generated)</span>
                                                </label>
                                                <input
                                                      type="text"
                                                      name="slug"
                                                      placeholder="e.g. mu-main-canteen"
                                                      value={canteenForm.slug}
                                                      onChange={handleCanteenChange}
                                                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-teal-800 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                />
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                      Your feedback link will be: <code className="text-teal-700 font-semibold">/feedback/{canteenForm.slug || 'slug'}</code>
                                                </p>
                                          </div>

                                          <button
                                                type="submit"
                                                className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md hover:-translate-y-0.5 mt-2"
                                          >
                                                <span>Continue to Owner Details</span>
                                                <FaArrowRight className="text-xs" />
                                          </button>
                                    </form>
                              ) : (
                                    /* STEP 2: OWNER ACCOUNT */
                                    <form onSubmit={handleFinalSetup} className="space-y-4">
                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Owner Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                      <FaUserTie className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="e.g. Dr. Rajesh Sharma"
                                                            value={ownerForm.name}
                                                            onChange={handleOwnerChange}
                                                            required
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Work Email <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                      <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="admin@marwadi.edu"
                                                            value={ownerForm.email}
                                                            onChange={handleOwnerChange}
                                                            required
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Password <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                      <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="password"
                                                            name="password"
                                                            placeholder="Minimum 6 characters"
                                                            value={ownerForm.password}
                                                            onChange={handleOwnerChange}
                                                            required
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                                      Confirm Password <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                      <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                      <input
                                                            type="password"
                                                            name="confirmPassword"
                                                            placeholder="Re-enter password"
                                                            value={ownerForm.confirmPassword}
                                                            onChange={handleOwnerChange}
                                                            required
                                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                </div>
                                          </div>

                                          <div className="flex gap-3 pt-2">
                                                <button
                                                      type="button"
                                                      onClick={() => setStep(1)}
                                                      className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                                                >
                                                      Back
                                                </button>
                                                <button
                                                      type="submit"
                                                      disabled={loading}
                                                      className="w-2/3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md"
                                                >
                                                      {loading ? 'Creating...' : 'Activate Canteen'}
                                                </button>
                                          </div>
                                    </form>
                              )}

                              <p className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
                                    Already have a canteen account?{' '}
                                    <Link to="/admin/login" className="text-teal-700 font-bold hover:underline">
                                          Log In
                                    </Link>
                              </p>
                        </div>
                  </div>
            </div>
      );
}
