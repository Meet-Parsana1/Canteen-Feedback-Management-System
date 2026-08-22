import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaUserTie, FaCheckCircle, FaUtensils } from 'react-icons/fa';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from '../components/CanteenLoader';
import Toast from '../components/Toast';

export default function AdminAcceptInvite() {
      const { token } = useParams();
      const navigate = useNavigate();

      const [name, setName] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null);

      const handleAccept = async (e) => {
            e.preventDefault();

            if (!name.trim() || !password) {
                  setToast({ message: 'Name and password are required.', type: 'warning' });
                  return;
            }

            if (password !== confirmPassword) {
                  setToast({ message: 'Passwords do not match.', type: 'warning' });
                  return;
            }

            if (password.length < 6) {
                  setToast({ message: 'Password must be at least 6 characters.', type: 'warning' });
                  return;
            }

            setLoading(true);

            try {
                  const res = await fetch(buildApiUrl('/api/admin/auth/accept-invite'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token, name: name.trim(), password }),
                  });

                  const data = await res.json();

                  if (res.ok && data.success) {
                        localStorage.setItem('adminToken', data.token);
                        setToast({
                              message: `Account activated for ${data.canteen?.name}! Loading dashboard...`,
                              type: 'success',
                        });

                        setTimeout(() => {
                              navigate('/admin');
                        }, 1200);
                  } else {
                        throw new Error(data.message || 'Invitation acceptance failed');
                  }
            } catch (err) {
                  console.error(err);
                  setToast({ message: err.message || 'Invalid or expired invitation.', type: 'error' });
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
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
                              text="Activating Staff Credentials..."
                              subtext="Binding account to assigned canteen workspace..."
                        />
                  )}

                  <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-9 max-w-md w-full border border-slate-200 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mx-auto mb-3">
                              <FaUtensils />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                              Join Canteen Team
                        </h1>
                        <p className="text-xs text-slate-500 mb-6">
                              You have been invited to manage dining feedback. Set up your administrator profile below.
                        </p>

                        <form onSubmit={handleAccept} className="space-y-4 text-left">
                              <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">
                                          Your Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                          <FaUserTie className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                          <input
                                                type="text"
                                                placeholder="e.g. Vikram Joshi"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                          />
                                    </div>
                              </div>

                              <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">
                                          Create Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                          <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                                          <input
                                                type="password"
                                                placeholder="Minimum 6 characters"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                                placeholder="Re-enter password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                          />
                                    </div>
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md mt-2"
                              >
                                    Accept & Open Dashboard
                              </button>
                        </form>

                        <p className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100">
                              Already registered? <Link to="/admin/login" className="text-teal-700 font-bold">Log in here</Link>
                        </p>
                  </div>
            </div>
      );
}
