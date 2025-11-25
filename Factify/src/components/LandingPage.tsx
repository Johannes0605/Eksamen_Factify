// src/components/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="text-center">
        <h1 style={{ color: '#000000', fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Factify</h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
          <button
            onClick={() => navigate('/demo-quiz')}
            className="w-64 px-8 py-4 rounded-lg text-xl font-semibold transition-colors shadow-lg"
            style={{ margin: '0 auto', backgroundColor: '#0b3d91', color: '#ffffff' }}
          >
            Try Demo Quiz
          </button>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
            <button
              onClick={() => navigate('/login')}
              className="w-44 px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              style={{ margin: '0', backgroundColor: '#374151', color: '#ffffff' }}
            >
              Login
            </button>

            <button
              onClick={() => navigate('/register')}
              className="w-44 px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              style={{ margin: '0', backgroundColor: '#10b981', color: '#ffffff' }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

