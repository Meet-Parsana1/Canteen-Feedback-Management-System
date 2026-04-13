import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildApiUrl } from "../utils/api";

function AdminSignup() {

      const navigate = useNavigate();

      const [form, setForm] = useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
      });

      const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSignup = async (e) => {

            e.preventDefault();

            if (form.password !== form.confirmPassword) {
                  alert("Passwords do not match");
                  return;
            }

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

                        alert("Signup successful");
                        navigate("/admin/login");

                  } else {

                        alert(data.message);

                  }

            } catch (error) {
                  console.error(error);
            }

      };

      return (
            <div className="min-h-screen flex flex-col md:flex-row">

                  {/* LEFT PANEL */}
                  <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-primary to-primaryDark text-white px-6 lg:px-12 py-10">

                        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
                              Canteen Feedback System
                        </h1>

                        <p className="text-sm lg:text-lg text-center max-w-md leading-relaxed">
                              Create an admin account to access analytics,
                              download reports, and monitor feedback trends.
                        </p>

                  </div>

                  {/* RIGHT PANEL */}
                  <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primaryLight via-white to-primaryLight px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-md border border-primaryLight">

                              {/* MOBILE HEADER */}
                              <div className="md:hidden text-center mb-6">
                                    <h1 className="text-xl font-bold text-primary">
                                          Canteen Feedback System
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                          Create your admin account
                                    </p>
                              </div>

                              <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6">
                                    Admin Signup
                              </h2>

                              <form onSubmit={handleSignup} className="space-y-4">

                                    {/* NAME */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Name</label>
                                          <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter name"
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
                                                placeholder="Enter email"
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
                                                placeholder="Create password"
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
                                          className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl hover:bg-primaryDark transition shadow text-sm sm:text-base"
                                    >
                                          Create Account
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
