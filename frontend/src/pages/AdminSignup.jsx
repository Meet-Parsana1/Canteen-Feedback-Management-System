import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildApiUrl } from "../utils/api";
import CanteenLoader from "../components/CanteenLoader";
import Toast from "../components/Toast";

function AdminSignup() {
      const navigate = useNavigate();

      const [form, setForm] = useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
      });
      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null); // { message, type }

      const showToast = (message, type = "info") => {
            setToast({ message, type });
      };

      const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSignup = async (e) => {
            e.preventDefault();

            if (form.password !== form.confirmPassword) {
                  showToast("Passwords do not match. Please recheck.", "warning");
                  return;
            }

            setLoading(true);

            try {
                  const res = await fetch(buildApiUrl("/api/admin/signup"), {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                              name: form.name,
                              email: form.email,
                              password: form.password
                        })
                  });

                  const data = await res.json();

                  if (res.ok) {
                        showToast("Account created successfully! Redirecting to login...", "success");
                        setTimeout(() => {
                              navigate("/admin/login");
                        }, 1500);
                  } else {
                        showToast(data.message || "Signup failed. Please try again.", "error");
                  }
            } catch (error) {
                  console.error(error);
                  showToast("Server error. Please try again later.", "error");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex flex-col md:flex-row relative">
                  {/* Custom Toast Notification */}
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
                              text="Creating Admin Account..."
                              subtext="Setting up your canteen management portal & permissions..."
                        />
                  )}

                  {/* LEFT PANEL */}
                  <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-primary to-primaryDark text-white px-6 lg:px-12 py-10">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
                              Join CanteenIQ
                        </h1>
                        <p className="text-sm lg:text-lg text-center max-w-md leading-relaxed">
                              Create an admin account to manage dining feedback, monitor food quality, and view actionable analytics.
                        </p>
                  </div>

                  {/* RIGHT PANEL */}
                  <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primaryLight via-white to-primaryLight px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-md border border-primaryLight hover:scale-[1.02] transition-transform">
                              {/* MOBILE HEADER */}
                              <div className="md:hidden text-center mb-6">
                                    <h1 className="text-xl font-bold text-primary">
                                          CanteenIQ Admin
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                          Create an admin account
                                    </p>
                              </div>

                              <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6">
                                    Admin Sign Up
                              </h2>

                              <form onSubmit={handleSignup} className="space-y-4">
                                    {/* NAME */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Full Name</label>
                                          <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter full name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full mt-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                                required
                                          />
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Email</label>
                                          <input
                                                type="email"
                                                name="email"
                                                placeholder="Enter admin email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="w-full mt-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                                required
                                          />
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Password</label>
                                          <input
                                                type="password"
                                                name="password"
                                                placeholder="Enter password"
                                                value={form.password}
                                                onChange={handleChange}
                                                className="w-full mt-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                                required
                                          />
                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Confirm Password</label>
                                          <input
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Confirm password"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full mt-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                                required
                                          />
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                          type="submit"
                                          disabled={loading}
                                          className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl hover:bg-primaryDark transition shadow text-sm sm:text-base disabled:opacity-50"
                                    >
                                          {loading ? "Creating Account..." : "Create Account"}
                                    </button>
                              </form>

                              {/* LOGIN LINK */}
                              <p className="text-center text-gray-500 mt-6 text-sm sm:text-base">
                                    Already have an account?{" "}
                                    <Link to="/admin/login" className="text-primary font-semibold">
                                          Login
                                    </Link>
                              </p>
                        </div>
                  </div>
            </div>
      );
}

export default AdminSignup;
