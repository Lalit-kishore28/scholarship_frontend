import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🎓 ScholarshipFinder
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.name}</span>
              {user?.role === 'admin' && (
                <Link to="/admin" className="bg-purple-500 px-3 py-2 rounded hover:bg-purple-600">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-green-500 px-3 py-2 rounded hover:bg-green-600">
                Login
              </Link>
              <Link to="/signup" className="bg-yellow-500 px-3 py-2 rounded hover:bg-yellow-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
