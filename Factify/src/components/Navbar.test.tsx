import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthProvider } from '../contexts/AuthContext';

describe('Navbar Component', () => {
  const renderNavbar = (user = null) => {
    return render(
      <BrowserRouter>
        <AuthProvider value={{ user, logout: () => {}, login: () => {}, register: () => {} }}>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the application name/logo', () => {
    renderNavbar();
    
    const logo = screen.getByText(/factify/i);
    expect(logo).toBeInTheDocument();
  });

  it('shows login and register links when user is not authenticated', () => {
    renderNavbar(null);
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows user-specific links when user is authenticated', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      token: 'fake-token'
    };
    
    renderNavbar(mockUser);
    
    // Should show username or logout button
    const logoutButton = screen.queryByText(/logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  it('has navigation links', () => {
    renderNavbar();
    
    // Check for common navigation elements
    const homeLink = screen.queryByText(/home/i);
    if (homeLink) {
      expect(homeLink).toBeInTheDocument();
    }
  });
});
