import { Routes, Route } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import ThankYou from "./components/ThankYou";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import StudentDashboard from "./components/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
      return (
            <Routes>
                  <Route path="/" element={<FeedbackForm />} />
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
      );
}

export default App;