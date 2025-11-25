import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api.service';
import { Quiz } from '../types/quiz.types';

function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await apiService.getAllQuizzes();
      setQuizzes(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Could not load quizzes');
      setLoading(false);
    }
  };

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const handleTakeQuiz = (quizId: number) => {
    navigate(`/take-quiz/${quizId}`);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#ffffff', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        
        {/* Left Side - User Quizzes */}
        <div>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              marginBottom: '8px',
              color: '#1e1919'
            }}>
              Welcome back, <span style={{ color: '#0061fe' }}>{user?.username}</span>!
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              marginBottom: '24px'
            }}>
              Here are all the available quizzes
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quizzes.map((quiz: any) => (
              <div key={quiz.quizId} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#0061fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  color: '#1e1919',
                  marginBottom: '8px'
                }}>
                  {quiz.title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  marginBottom: '16px'
                }}>
                  {quiz.description}
                </p>
                <button
                  onClick={() => handleTakeQuiz(quiz.quizId)}
                  style={{
                    backgroundColor: '#0061fe',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052d9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0061fe'}
                >
                  Take Quiz →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Create New Quiz Card */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          position: 'sticky',
          top: '100px'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#0061fe'
              }}></div>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>CREATE NEW</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
              Build Your Own Quiz
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Create engaging quizzes with custom questions and share them with others
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✏️</div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Quiz Builder</p>
              <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Add questions, answers & more</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/quiz-form')}
            style={{
              width: '100%',
              backgroundColor: '#0061fe',
              color: '#ffffff',
              padding: '14px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0, 97, 254, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052d9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0061fe'}
          >
            Create New Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
