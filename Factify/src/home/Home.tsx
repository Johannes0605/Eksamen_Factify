import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api.service';
import { Quiz } from '../types/quiz.types';

function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const loadQuizzes = async () => {
    try {
      const data = await apiService.getAllQuizzes();
      setQuizzes(data);
      if (data.length > 0) {
        setSelectedQuiz(data[0]); // Select first quiz by default
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Could not load quizzes');
      setLoading(false);
    }
  };

  const handleEdit = (quizId: number) => {
    navigate(`/quiz-form/${quizId}`);
  };

  const handleDuplicate = async (quizId: number) => {
    try {
      await apiService.duplicateQuiz(quizId);
      loadQuizzes();
      setOpenMenuId(null);
    } catch (err) {
      console.error('Error duplicating quiz:', err);
    }
  };

  const handleShare = (quizId: number) => {
    const shareUrl = `${window.location.origin}/take-quiz/${quizId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Quiz link copied to clipboard!');
    setOpenMenuId(null);
  };

  const handleDelete = async (quizId: number) => {
    try {
      await apiService.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(q => q.quizId !== quizId));
      if (selectedQuiz?.quizId === quizId) {
        setSelectedQuiz(quizzes.length > 1 ? quizzes.find(q => q.quizId !== quizId) || null : null);
      }
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  if (loading) return <p style={{ color: '#ffffff', padding: '80px 24px' }}>Loading quizzes...</p>;
  if (error) return <p style={{ color: '#ef4444', padding: '80px 24px' }}>{error}</p>;

  const handleTakeQuiz = (quizId: number) => {
    navigate(`/take-quiz/${quizId}`);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        
        {/* Left Side - User Quizzes */}
        <div>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              marginBottom: '8px',
              color: '#ffffff'
            }}>
              Welcome back, <span style={{ color: '#60a5fa' }}>{user?.username}</span>!
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#ffffff', 
              marginBottom: '24px'
            }}>
              Here are all the available quizzes
            </p>
          </div>

          {quizzes.length === 0 ? (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              border: '2px dashed #d1d5db'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
                No quizzes yet
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '24px' }}>
                Get started by creating your first quiz
              </p>
              <button
                onClick={() => navigate('/quiz-form')}
                style={{
                  backgroundColor: '#0061fe',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052d9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0061fe'}
              >
                Create your first quiz!
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quizzes.map((quiz: any) => (
                <div 
                  key={quiz.quizId} 
                  onClick={() => setSelectedQuiz(quiz)}
                  style={{
                    backgroundColor: selectedQuiz?.quizId === quiz.quizId ? '#ffffff' : '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px',
                    border: selectedQuiz?.quizId === quiz.quizId ? '2px solid #0061fe' : '1px solid #e5e7eb',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedQuiz?.quizId !== quiz.quizId) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#0061fe';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedQuiz?.quizId !== quiz.quizId) {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
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
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTakeQuiz(quiz.quizId);
                          }}
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
                    </div>

                    {/* Three-dot menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          setOpenMenuId(openMenuId === quiz.quizId ? null : quiz.quizId);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          color: '#6b7280'
                        }}
                      >
                        ⋮
                      </button>

                      {openMenuId === quiz.quizId && (
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          zIndex: 10,
                          minWidth: '150px',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(quiz.quizId);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#1e1919'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(quiz.quizId);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#1e1919'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(quiz.quizId);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#1e1919'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(quiz.quizId);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#ef4444'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Quiz Preview */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          position: 'sticky',
          top: '100px'
        }}>
          {selectedQuiz ? (
            <>
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
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>QUIZ PREVIEW</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
                  <span style={{ color: '#0061fe' }}>Take:</span> {selectedQuiz.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '20px' }}>
                  {selectedQuiz.description}
                </p>
              </div>

              <div style={{ 
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '20px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e1919', marginBottom: '16px' }}>
                      Questions ({selectedQuiz.questions.length})
                    </h4>
                    {selectedQuiz.questions.map((q: any, index: number) => (
                      <div key={index} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: index < selectedQuiz.questions.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                        <p style={{ color: '#1e1919', fontSize: '0.875rem' }}>
                          {index + 1}. {q.questionText}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                    <p style={{ fontSize: '0.875rem' }}>No questions yet</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleTakeQuiz(selectedQuiz.quizId)}
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
                Take This Quiz →
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
                No quiz selected
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Create your first quiz to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setDeleteConfirmId(null)}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '400px',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1919', marginBottom: '12px' }}>
              Delete Quiz?
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '24px' }}>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  color: '#1e1919',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
