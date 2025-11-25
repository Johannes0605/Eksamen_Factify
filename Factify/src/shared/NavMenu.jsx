import { Link } from 'react-router-dom';

export default function NavMenu() {
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
        height: '64px',
        padding: '0 24px'
      }}>
        {/* Logo/Brand */}
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

        {/* Center Navigation Links */}
        <div style={{ 
          display: 'flex', 
          gap: '32px',
          alignItems: 'center'
        }}>
          <Link 
            to="/" 
            style={{
              color: '#1e1919',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0061fe'}
            onMouseLeave={(e) => e.target.style.color = '#1e1919'}
          >
            Home
          </Link>
          <Link 
            to="/quiz-list" 
            style={{
              color: '#1e1919',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0061fe'}
            onMouseLeave={(e) => e.target.style.color = '#1e1919'}
          >
            Quizzes
          </Link>
          <Link 
            to="/demo-quiz" 
            style={{
              color: '#1e1919',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0061fe'}
            onMouseLeave={(e) => e.target.style.color = '#1e1919'}
          >
            Demo
          </Link>
        </div>

        {/* Right side - Login/Register */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
            Login
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
        </div>
      </div>
    </nav>
  );
}


