import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import ScholarshipFinder from './ScholarshipFinder';
import ScholarshipDetails from './ScholarshipDetails';
import AdminDashboard from './AdminDashboard';
import AddScholarship from './AddScholarship';
import EditScholarship from './EditScholarship';
import { FavoritesProvider } from './FavoritesContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
            <Route
              path="/"
              element={isAuthenticated ? <ScholarshipFinder /> : <Navigate to="/login" />}
            />
            <Route
              path="/scholarship/:id"
              element={isAuthenticated ? <ScholarshipDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/add-scholarship"
              element={isAuthenticated && user?.role === 'admin' ? <AddScholarship /> : <Navigate to="/" />}
            />
            <Route
              path="/edit-scholarship/:id"
              element={isAuthenticated && user?.role === 'admin' ? <EditScholarship /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
