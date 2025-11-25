import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavMenu() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '70px',
        padding: '0 24px'
      }}>
        {/* Logo/Brand - Links to Landing Page */}
        <Link 
          to="/" 
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0061fe',
            textDecoration: 'none',
            letterSpacing: '-0.5px'
          }}
        >
          Factify
        </Link>

        {/* Right side - Conditional buttons based on auth state */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                style={{
                  color: '#1e1919',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f7f5f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                style={{
                  color: '#ffffff',
                  backgroundColor: '#0061fe',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0052d9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0061fe'}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/quiz-list" 
                style={{
                  color: '#1e1919',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f7f5f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                My Quizzes
              </Link>
              <Link 
                to="/quiz-form" 
                style={{
                  color: '#1e1919',
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f7f5f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Make New Quiz
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  color: '#ffffff',
                  backgroundColor: '#0061fe',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0052d9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0061fe'}
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


