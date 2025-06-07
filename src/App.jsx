// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import AuthorDashboard from './pages/AuthorDashboard';
import ReaderDashboard from './pages/ReaderDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function RoleBasedDashboard() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'author') {
    return <AuthorDashboard />;
  } else {
    return <ReaderDashboard />;
  }
}

export default App;