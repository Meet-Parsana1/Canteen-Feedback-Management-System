import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import ThankYou from "./components/ThankYou";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import StudentDashboard from "./components/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import CanteenLoader from "./components/CanteenLoader";

function App() {
      const location = useLocation();
      const [pageLoading, setPageLoading] = useState(true);

      useEffect(() => {
            // Scroll to top immediately on route change
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });

            // Trigger brief, elegant canteen transition loader
            setPageLoading(true);
            const timer = setTimeout(() => {
                  setPageLoading(false);
            }, 380);

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
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/feedback" element={<FeedbackForm />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                        <Route path="/dashboard" element={<StudentDashboard />} />

                        {/* ADMIN */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/signup" element={<AdminSignup />} />
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
      switch (path) {
            case "/":
                  return "Welcome to CanteenIQ...";
            case "/feedback":
                  return "Opening Student Feedback Form...";
            case "/dashboard":
                  return "Loading Campus Dining Analytics...";
            case "/thank-you":
                  return "Plating submission confirmation...";
            case "/admin/login":
                  return "Opening Admin Security Portal...";
            case "/admin/signup":
                  return "Setting up Admin Registration...";
            case "/admin":
                  return "Loading Admin Command Center...";
            default:
                  return "Serving your page...";
      }
}

export default App;