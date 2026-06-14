import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import StarfieldBackground from "./components/3d/StarfieldBackground";
import NeuralWebBackground from "./components/layout/NeuralWebBackground";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CustomCursor from "./components/layout/CustomCursor";
import Chatbot from "./components/Chatbot";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AnalyzeNew from "./pages/AnalyzeNew";
import AnalyzeResults from "./pages/AnalyzeResults";
import History from "./pages/History";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Team from "./pages/Team";
import Blog from "./pages/Blog";
import FairnessMeterPlayground from "./pages/FairnessMeterPlayground";
import UseCases from "./pages/UseCases";
import DeveloperPortal from "./pages/DeveloperPortal";

// Scroll to top on navigation/redirect
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Spring Page Transition Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -15, scale: 0.99 }}
    transition={{
      type: "spring",
      stiffness: 140,
      damping: 20,
      mass: 0.6
    }}
    style={{ display: "flex", flexDirection: "column", flex: 1 }}
  >
    {children}
  </motion.div>
);

// Redirect logged-in users away from auth pages
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    const isAdmin = ["super_admin", "org_admin", "admin"].includes(user?.role);
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }
  return children;
};

// Require login — redirect to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

// Require admin role (super_admin or org_admin)
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return ["super_admin", "org_admin", "admin"].includes(user?.role) ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function BackgroundController() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {isHome ? <StarfieldBackground /> : <NeuralWebBackground />}
      {!isHome && <div className="non-home-bg" />}
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main
        style={{ flex: 1, paddingTop: "var(--navbar-h)" }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
            <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/use-cases" element={<PageTransition><UseCases /></PageTransition>} />
            <Route path="/use-cases/:tab" element={<PageTransition><UseCases /></PageTransition>} />

            {/* Auth routes — redirect to dashboard if already logged in */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <PageTransition><Login /></PageTransition>
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <PageTransition><Register /></PageTransition>
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <PageTransition><ForgotPassword /></PageTransition>
                </PublicOnlyRoute>
              }
            />

            {/* Protected routes — require login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze/new"
              element={
                <ProtectedRoute>
                  <PageTransition><AnalyzeNew /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze/results"
              element={
                <ProtectedRoute>
                  <PageTransition><AnalyzeResults /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <PageTransition><History /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PageTransition><Settings /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fairness-meter"
              element={
                <ProtectedRoute>
                  <PageTransition><FairnessMeterPlayground /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <PageTransition><AdminDashboard /></PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="/developer"
              element={
                <ProtectedRoute>
                  <PageTransition><DeveloperPortal /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      {/* Only show chatbot to logged-in users */}
      {user && <Chatbot />}
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
      }
    >
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <CustomCursor />
            <BackgroundController />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
