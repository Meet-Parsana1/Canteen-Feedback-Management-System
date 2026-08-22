import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaLock, FaEnvelope, FaEye, FaArrowLeft } from 'react-icons/fa';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from '../components/CanteenLoader';
import Toast from '../components/Toast';

function AdminLogin() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null);

      const navigate = useNavigate();

      const showToast = (message, type = 'info') => {
            setToast({ message, type });
      };

      const handleLogin = async (e) => {
            e.preventDefault();
            setLoading(true);

            try {
                  const res = await fetch(buildApiUrl('/api/admin/auth/login'), {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email.trim(), password }),
                  });

                  const data = await res.json();

                  if (res.ok && data.success) {
                        localStorage.setItem('adminToken', data.token);
                        showToast(`Welcome back! Loading ${data.canteen?.name || 'Canteen'} console...`, 'success');
                        setTimeout(() => {
                              navigate('/admin');
                        }, 900);
                  } else {
                        showToast(data.message || 'Invalid credentials. Please verify your email and password.', 'error');
                  }
            } catch (error) {
                  console.error(error);
                  showToast('Server connection error. Please try again later.', 'error');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative">
                  {/* Custom Toast */}
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
                              text="Authenticating Administrator..."
                              subtext="Resolving canteen tenant boundary & loading dining analytics console..."
                        />
                  )}

                  {/* LEFT HERO PANEL */}
                  <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                              <Link to="/" className="inline-flex items-center gap-2 text-teal-400 font-extrabold text-xl mb-8">
                                    <FaUtensils />
                                    <span>Canteen<span className="text-white">IQ</span></span>
                              </Link>

                              <div className="space-y-4 max-w-sm">
                                    <span className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
                                          Admin Security Portal
                                    </span>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                          Canteen Management & Real-Time Intelligence
                                    </h1>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                          Monitor dining feedback trends, inspect hygiene sentiment, export Excel reports, and manage table QR codes securely.
                                    </p>
                              </div>
                        </div>

                        <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                              <p className="font-semibold text-slate-300">Default Sandbox Credentials:</p>
                              <p className="font-mono text-teal-300 bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                                    Email: admin@canteen.iq<br />
                                    Password: Admin@123
                              </p>
                        </div>
                  </div>

                  {/* RIGHT FORM PANEL */}
                  <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                        <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-9 max-w-md w-full border border-slate-200/90">
                              <div className="mb-2">
                                    <Link
                                          to="/"
                                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-700 transition mb-4"
                                    >
                                          <FaArrowLeft className="text-[10px]" /> Back to Home
                                    </Link>
                              </div>

                              <div className="text-center mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mx-auto mb-3 shadow-sm">
                                          <FaLock />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                          Admin Portal Login
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                          Enter your administrator credentials to access your canteen dashboard.
                                    </p>
                              </div>

                              <form onSubmit={handleLogin} className="space-y-4">
                                    {/* EMAIL */}
                                    <div>
                                          <label className="text-xs font-bold text-slate-700 block mb-1">
                                                Admin Email Address
                                          </label>
                                          <div className="relative">
                                                <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                <input
                                                      type="email"
                                                      placeholder="admin@canteen.iq"
                                                      value={email}
                                                      onChange={(e) => setEmail(e.target.value)}
                                                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      required
                                                />
                                          </div>
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                          <label className="text-xs font-bold text-slate-700 block mb-1">
                                                Password
                                          </label>
                                          <div className="relative">
                                                <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                                <input
                                                      type="password"
                                                      placeholder="••••••••"
                                                      value={password}
                                                      onChange={(e) => setPassword(e.target.value)}
                                                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      required
                                                />
                                          </div>
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                          type="submit"
                                          disabled={loading}
                                          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-teal-600/20 disabled:opacity-50 mt-2"
                                    >
                                          {loading ? 'Verifying...' : 'Sign In to Dashboard'}
                                    </button>
                              </form>

                              {/* SETUP NEW CANTEEN LINK */}
                              <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
                                    <p className="text-xs text-slate-500">
                                          Need to register a new canteen?{' '}
                                          <Link to="/admin/setup" className="text-teal-700 font-bold hover:underline">
                                                Register Canteen
                                          </Link>
                                    </p>
                                    <p className="text-xs text-slate-400">
                                          Want to test first?{' '}
                                          <Link to="/demo/admin" className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1">
                                                <FaEye className="text-[10px]" /> Explore Admin Demo
                                          </Link>
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default AdminLogin;
