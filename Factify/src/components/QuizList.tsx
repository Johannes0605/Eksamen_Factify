// src/components/QuizList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import { Quiz } from '../types/quiz.types';

interface QuizListProps {
  onSelectQuiz?: (quizId: number) => void;
  onCreateNew?: () => void;
  onTakeQuiz?: (quizId: number) => void;
}

const QuizList: React.FC<QuizListProps> = ({ onSelectQuiz, onCreateNew, onTakeQuiz }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await apiService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError('Could not load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await apiService.deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.quizId !== id));
    } catch (err) {
      alert('Could not delete quiz');
    }
  };

  const handleTakeQuiz = (quizId: number) => {
    if (onTakeQuiz) {
      onTakeQuiz(quizId);
    } else {
      navigate(`/take-quiz/${quizId}`);
    }
  };

  const handleEditQuiz = (quizId: number) => {
    if (onSelectQuiz) {
      onSelectQuiz(quizId);
    } else {
      navigate(`/quiz-form/${quizId}`);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      navigate('/quiz-form');
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold text-dark-custom mb-0">My Quizzes</h1>
            <p className="text-secondary-custom mt-2">View, edit, and take your created quizzes</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="btn btn-primary"
            style={{ fontSize: '15px', fontWeight: 600, padding: '12px 24px' }}
          >
            Create New Quiz
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {/* Empty State */}
        {quizzes.length === 0 ? (
          <div className="bg-light-custom rounded-xl p-5 border border-light-custom text-center">
            <p className="text-secondary-custom mb-0" style={{ fontSize: '1.125rem' }}>No quizzes yet</p>
            <p className="text-secondary small mt-2">Create your first quiz to get started</p>
          </div>
        ) : (
          <div className="row g-4">
            {quizzes.map((quiz) => (
              <div key={quiz.quizId} className="col-12 col-md-6 col-lg-4">
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#0061fe';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 700, 
                    color: '#1e1919',
                    marginBottom: '8px'
                  }}>
                    {quiz.title}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    marginBottom: '16px',
                    flex: 1
                  }}>
                    {quiz.description || 'No description provided'}
                  </p>
                  <div style={{ 
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      fontWeight: 600
                    }}>
                      {quiz.questions?.length || 0} Questions
                    </span>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleTakeQuiz(quiz.quizId)}
                      className="btn btn-primary flex-grow-1"
                      style={{ fontSize: '13px', padding: '10px 12px' }}
                    >
                      Take Quiz
                    </button>
                    <button
                      onClick={() => handleEditQuiz(quiz.quizId)}
                      className="btn btn-outline-secondary flex-grow-1"
                      style={{ fontSize: '13px', padding: '10px 12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.quizId)}
                      className="btn btn-outline-danger"
                      style={{ fontSize: '13px', padding: '10px 12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;