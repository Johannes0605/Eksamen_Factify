import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavMenu.css';

export default function NavMenu() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container-lg">
        {/* Logo/Brand - Links to Landing Page or Home based on auth */}
        <Link 
          to={isAuthenticated ? "/home" : "/"} 
          className="navbar-brand fw-bold text-primary me-auto"
        >
          Factify
        </Link>

        {/* Right side - Conditional buttons based on auth state */}
        <div className="d-flex gap-2 align-items-center">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="btn btn-link text-dark text-decoration-none fw-500"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/quiz-list" 
                className="btn btn-link text-dark text-decoration-none fw-500"
              >
                My Quizzes
              </Link>
              <Link 
                to="/quiz-form" 
                className="btn btn-link text-dark text-decoration-none fw-500"
              >
                Make New Quiz
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-primary"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


