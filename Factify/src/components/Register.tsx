// src/components/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password does not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/home');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      
      // Check if the error is about email already being registered
      if (errorMessage.toLowerCase().includes('email already registered')) {
        setError('This email is already in use. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container d-flex align-items-start justify-content-center min-vh-100" style={{ paddingTop: '50px' }}>
      <div className="register-card card border-0 shadow-lg rounded-4 w-100" style={{ maxWidth: '480px' }}>
        <div className="card-body p-5">
          <div className="mb-5">
            <h1 className="h2 fw-bold text-dark mb-0">
              Create your account
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
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="form-control form-control-lg rounded-pill register-input"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="form-control form-control-lg rounded-pill register-input"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="form-control form-control-lg rounded-pill register-input"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="form-control form-control-lg rounded-pill register-input"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg mb-3 w-100 rounded-pill"
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="small text-muted mb-0">
              Already have an account?{' '}
              <a href="/login" className="text-decoration-none fw-semibold gradient-text">
                Log in
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

export default Register;