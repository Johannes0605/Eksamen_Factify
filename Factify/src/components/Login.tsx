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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate user and redirect to home on success
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Wrong email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    setResetLoading(true);

    try {
      // Build API URL from environment variable
      const VITE_API = (import.meta as any).env?.VITE_API_URL;
      const API_BASE_URL = (VITE_API ? `${String(VITE_API).replace(/\/$/, '')}` : 'https://localhost:5001');
      
      console.log('Sending forgot password request to:', `${API_BASE_URL}/api/account/forgot-password`);
      console.log('Email:', resetEmail);
      
      // Request password reset from backend
      const response = await fetch(`${API_BASE_URL}/api/account/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to send reset email');
      }

      const data = await response.json();
      console.log('Success response:', data);

      setResetMessage('Password reset instructions have been sent to your email.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (err) {
      console.error('Forgot password error:', err);
      setResetMessage('Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-start justify-content-center min-vh-100" style={{ paddingTop: '80px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' }}>
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

          {!showForgotPassword ? (
            <>
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

                {error && (
                  <div className="text-center mb-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="btn btn-link text-decoration-none small"
                      style={{ color: '#3b82f6' }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg mb-3 w-100 rounded-pill"
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="small text-muted mb-0">
                  Don't have an account?{' '}
                  <a href="/register" className="text-decoration-none fw-semibold gradient-text">
                    Register
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="h5 text-dark mb-3">Reset Your Password</h3>
                <p className="small text-muted">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {resetMessage && (
                <div className={`alert ${resetMessage.includes('sent') ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
                  {resetMessage}
                </div>
              )}

              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="form-control form-control-lg rounded-pill login-input"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="btn btn-primary btn-lg mb-3 w-100 rounded-pill"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetMessage('');
                      setResetEmail('');
                    }}
                    className="btn btn-link text-decoration-none small"
                    style={{ color: '#6b7280' }}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}

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