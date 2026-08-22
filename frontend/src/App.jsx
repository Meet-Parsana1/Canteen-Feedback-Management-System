import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CanteenFeedbackPage from "./components/CanteenFeedbackPage";
import ThankYou from "./components/ThankYou";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSetup from "./pages/AdminSetup";
import AdminSignup from "./pages/AdminSignup";
import AdminAcceptInvite from "./pages/AdminAcceptInvite";
import DemoStudent from "./pages/DemoStudent";
import DemoAdmin from "./pages/DemoAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import CanteenLoader from "./components/CanteenLoader";

function App() {
      const location = useLocation();
      const [pageLoading, setPageLoading] = useState(true);

      useEffect(() => {
            // Scroll to top immediately on route change
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });

            // Trigger brief canteen transition loader
            setPageLoading(true);
            const timer = setTimeout(() => {
                  setPageLoading(false);
            }, 300);

            return () => clearTimeout(timer);
      }, [location.pathname]);

      return (
            <div className="min-h-screen flex flex-col font-sans">
                  {pageLoading && (
                        <CanteenLoader
                              fullScreen={true}
                              text={getRouteLoadingMessage(location.pathname)}
                        />
                  )}

                  <Routes>
                        {/* LANDING */}
                        <Route path="/" element={<LandingPage />} />

                        {/* STUDENT REAL FEEDBACK */}
                        <Route path="/feedback/:canteenSlug" element={<CanteenFeedbackPage />} />
                        <Route path="/feedback" element={<CanteenFeedbackPage />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                        <Route path="/dashboard/:canteenSlug" element={<StudentDashboard />} />
                        <Route path="/dashboard" element={<StudentDashboard />} />

                        {/* DEMO EXPERIENCE */}
                        <Route path="/demo/student" element={<DemoStudent />} />
                        <Route path="/demo/admin" element={<DemoAdmin />} />

                        {/* ADMIN AUTH & ONBOARDING */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/setup" element={<AdminSetup />} />
                        <Route path="/admin/signup" element={<AdminSignup />} />
                        <Route path="/admin/invite/:token" element={<AdminAcceptInvite />} />

                        {/* PROTECTED ADMIN CONSOLE */}
                        <Route
                              path="/admin"
                              element={
                                    <ProtectedRoute>
                                          <AdminDashboard />
                                    </ProtectedRoute>
                              }
                        />
                  </Routes>
            </div>
      );
}

// Tailored canteen micro-slogans for specific routes
function getRouteLoadingMessage(path) {
      if (path.startsWith("/feedback")) return "Connecting to Canteen Feedback Portal...";
      if (path.startsWith("/demo/student")) return "Loading Student Experience Sandbox...";
      if (path.startsWith("/demo/admin")) return "Loading Admin Command Center Sandbox...";
      if (path.startsWith("/admin/setup")) return "Opening Canteen Registration Wizard...";
      if (path.startsWith("/admin/login")) return "Opening Admin Security Portal...";
      if (path.startsWith("/admin/invite")) return "Verifying Staff Invitation Link...";
      if (path === "/admin") return "Loading Admin Command Center...";
      if (path.startsWith("/dashboard")) return "Loading Dining Hall Transparency Analytics...";
      if (path === "/thank-you") return "Plating submission confirmation...";
      return "Welcome to CanteenIQ...";
}

export default App;