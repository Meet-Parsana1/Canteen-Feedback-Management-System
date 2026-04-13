import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildApiUrl } from "../utils/api";

function AdminLogin() {

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");

      const navigate = useNavigate();

      const handleLogin = async (e) => {

            e.preventDefault();

            try {

                  const res = await fetch(buildApiUrl("/api/admin/login"), {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                  });

                  const data = await res.json();

                  if (res.ok) {

                        localStorage.setItem("adminToken", data.token);

                        alert("Login successful");

                        navigate("/admin");

                  } else {

                        alert(data.message);

                  }

            } catch (error) {

                  console.error(error);

                  alert("Server error");

            }

      };

      return (
            <div className="min-h-screen flex flex-col md:flex-row">

                  {/* LEFT PANEL */}
                  <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-primary to-primaryDark text-white px-6 lg:px-12 py-10">

                        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
                              Canteen Analytics
                        </h1>

                        <p className="text-sm lg:text-lg text-center max-w-md leading-relaxed">
                              Monitor feedback trends and improve canteen
                              food quality using real student insights.
                        </p>

                  </div>

                  {/* RIGHT PANEL */}
                  <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primaryLight via-white to-primaryLight px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-md border border-primaryLight hover:scale-[1.02] transition-transform">

                              {/* MOBILE HEADER */}
                              <div className="md:hidden text-center mb-6">
                                    <h1 className="text-xl font-bold text-primary">
                                          Canteen Analytics
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                          Login to your admin account
                                    </p>
                              </div>

                              <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6">
                                    Admin Login
                              </h2>

                              <form onSubmit={handleLogin} className="space-y-4">

                                    {/* EMAIL */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Email</label>
                                          <input
                                                type="email"
                                                placeholder="Enter admin email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full mt-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                                required
                                          />
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                          <label className="text-gray-600 text-sm">Password</label>
                                          <input
                                                type="password"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full mt-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                                required
                                          />
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                          type="submit"
                                          className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl hover:bg-primaryDark transition shadow text-sm sm:text-base"
                                    >
                                          Login
                                    </button>

                              </form>

                              {/* SIGNUP LINK */}
                              <p className="text-center text-gray-500 mt-6 text-sm sm:text-base">
                                    Don't have an account?{" "}
                                    <Link to="/admin/signup" className="text-primary font-semibold">
                                          Sign Up
                                    </Link>
                              </p>

                        </div>
                  </div>
            </div>
      );
}

export default AdminLogin;
