import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import StarfieldBackground from './components/3d/StarfieldBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot';

// Pages (We will import these as we create them)
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
import Pricing from './pages/Pricing';
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

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analyze/new" element={<ProtectedRoute><AnalyzeNew /></ProtectedRoute>} />
          <Route path="/analyze/results" element={<ProtectedRoute><AnalyzeResults /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/pricing" element={<Pricing />} />
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
          
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"; // Replace with actual Client ID

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
        <Router>
          <StarfieldBackground />
          <AppRoutes />
          <Chatbot />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
