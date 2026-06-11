import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import StarfieldBackground from './components/3d/StarfieldBackground';
import NeuralWebBackground from './components/layout/NeuralWebBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/layout/CustomCursor';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AnalyzeNew from './pages/AnalyzeNew';
import AnalyzeResults from './pages/AnalyzeResults';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Docs from './pages/Docs';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import Team from './pages/Team';
import Blog from './pages/Blog';
import FairnessMeterPlayground from './pages/FairnessMeterPlayground';
import Firewall from './pages/Firewall';
import DriftMonitor from './pages/DriftMonitor';
import Hiring from './pages/use-cases/Hiring';
import Lending from './pages/use-cases/Lending';
import Healthcare from './pages/use-cases/Healthcare';
import Vision from './pages/use-cases/Vision';
import DeveloperPortal from './pages/DeveloperPortal';

// Redirect logged-in users away from auth pages
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Require login — redirect to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

// Require admin role
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

function BackgroundController() {
  const location = useLocation();
  return location.pathname === '/' ? (
    <StarfieldBackground />
  ) : (
    <>
      <div className="non-home-bg" />
      <NeuralWebBackground />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' && location.pathname !== '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 'var(--navbar-h)' }} className={isAdmin ? 'admin-layout' : ''}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/team" element={<Team />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/use-cases/hiring" element={<Hiring />} />
            <Route path="/use-cases/lending" element={<Lending />} />
            <Route path="/use-cases/healthcare" element={<Healthcare />} />
            <Route path="/use-cases/vision" element={<Vision />} />

            {/* Auth routes — redirect to dashboard if already logged in */}
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />

            {/* Protected routes — require login */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analyze/new" element={<ProtectedRoute><AnalyzeNew /></ProtectedRoute>} />
            <Route path="/analyze/results" element={<ProtectedRoute><AnalyzeResults /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/fairness-meter" element={<ProtectedRoute><FairnessMeterPlayground /></ProtectedRoute>} />
            <Route path="/firewall" element={<ProtectedRoute><Firewall /></ProtectedRoute>} />
            <Route path="/drift-monitor" element={<ProtectedRoute><DriftMonitor /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/developer" element={<ProtectedRoute><DeveloperPortal /></ProtectedRoute>} />


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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <CustomCursor />
            <BackgroundController />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
