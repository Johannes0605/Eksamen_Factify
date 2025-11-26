// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Wrong email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100 p-4">
      <div className="login-card card border-0 shadow-lg rounded-4 w-100" style={{ maxWidth: '480px' }}>
        <div className="card-body p-5">
          <div className="mb-5">
            <h1 className="h2 fw-bold text-dark mb-0">
              Sign in to get started
            </h1>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="form-control form-control-lg rounded-pill login-input"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="form-control form-control-lg rounded-pill login-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gradient btn-lg w-100 rounded-pill fw-semibold"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="small text-muted mb-0">
              Don't have an account?{' '}
              <a href="/register" className="text-decoration-none fw-semibold gradient-text">
                Register
              </a>
            </p>
          </div>

          <div className="mt-3 text-center">
            <a href="/" className="text-secondary text-decoration-none small">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;