import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze/new" element={<AnalyzeNew />} />
            <Route path="/analyze/results" element={<AnalyzeResults />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/team" element={<Team />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/fairness-meter" element={<FairnessMeterPlayground />} />
            <Route path="/firewall" element={<Firewall />} />
            <Route path="/drift-monitor" element={<DriftMonitor />} />
            <Route path="/use-cases/hiring" element={<Hiring />} />
            <Route path="/use-cases/lending" element={<Lending />} />
            <Route path="/use-cases/healthcare" element={<Healthcare />} />
            <Route path="/use-cases/vision" element={<Vision />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
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
            <Chatbot />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
