import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api.service';
import { Quiz } from '../types/quiz.types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'used'>('created');
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

  // Memoize sorted quizzes to prevent re-sorting on every render
  const sortedQuizzes = useMemo(() => {
    const sorted = [...quizzes];
    if (sortBy === 'created') {
      return sorted.sort((a, b) => 
        new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime()
      );
    } else {
      return sorted.sort((a, b) => 
        new Date(b.lastUsedDate || 0).getTime() - new Date(a.lastUsedDate || 0).getTime()
      );
    }
  }, [quizzes, sortBy]);

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
      
      // Use functional state update to avoid stale state
      setQuizzes(prevQuizzes => {
        const newQuizzes = prevQuizzes.filter(q => q.quizId !== quizId);
        
        // If deleted quiz was selected, select first remaining quiz or null
        if (selectedQuiz?.quizId === quizId) {
          setSelectedQuiz(newQuizzes.length > 0 ? newQuizzes[0] : null);
        }
        
        return newQuizzes;
      });
      
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  if (loading) return <div className="text-white p-5" style={{ minHeight: 'calc(100vh - 64px)' }}>Loading quizzes...</div>;
  if (error) return <div className="text-danger p-5" style={{ minHeight: 'calc(100vh - 64px)' }}>{error}</div>;

  const handleTakeQuiz = (quizId: number) => {
    navigate(`/take-quiz/${quizId}`);
  };

  return (
    <div className="home-container min-vh-100 py-5">
      <div className="container-lg">
        {/* Header */}
        <div className="mb-5">
          <h1 className="display-4 fw-bold text-white mb-3">
            Welcome back, <span className="text-primary">{user?.username}</span>!
          </h1>
          <p className="fs-5 text-white-50 mb-0">
            Here are all the available quizzes
          </p>
        </div>

        <div className="row g-5">
          {/* Left Side - User Quizzes */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div></div>
              {quizzes.length > 0 && (
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-white-50 fw-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'created' | 'used')}
                    className="form-select form-select-sm home-sort-select"
                  >
                    <option value="created">Date Created</option>
                    <option value="used">Recently Used</option>
                  </select>
                </div>
              )}
            </div>

            {quizzes.length === 0 ? (
              <div className="bg-light rounded-3 p-5 text-center border border-2 border-dashed">
                <h3 className="fw-bold text-dark mb-2">
                  No quizzes yet
                </h3>
                <p className="text-muted small mb-4">
                  Get started by creating your first quiz
                </p>
                <button
                  onClick={() => navigate('/quiz-form')}
                  className="btn btn-primary"
                >
                  Create your first quiz!
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {sortedQuizzes.map((quiz: any) => (
                  <div 
                    key={quiz.quizId} 
                    onClick={() => setSelectedQuiz(quiz)}
                    className="quiz-item p-4 rounded-3 cursor-pointer"
                    style={{
                      backgroundColor: selectedQuiz?.quizId === quiz.quizId ? '#dbeafe' : '#f9fafb',
                      borderLeft: selectedQuiz?.quizId === quiz.quizId ? '5px solid #60a5fa' : '5px solid transparent',
                      border: selectedQuiz?.quizId === quiz.quizId ? '2px solid #60a5fa' : '1px solid #e5e7eb',
                      boxShadow: selectedQuiz?.quizId === quiz.quizId ? '0 4px 20px rgba(96, 165, 250, 0.4)' : 'none'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h3 className="fs-5 fw-bold text-dark mb-2">
                          {quiz.title}
                        </h3>
                        <p className="text-muted small mb-0">
                          {quiz.description}
                        </p>
                      </div>

                      {/* Three-dot menu */}
                      <div className="position-relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            setOpenMenuId(openMenuId === quiz.quizId ? null : quiz.quizId);
                          }}
                          className="menu-dots-btn"
                        >
                          ⋮
                        </button>

                        {openMenuId === quiz.quizId && (
                          <div className="dropdown-menu-custom">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(quiz.quizId);
                              }}
                              className="menu-item"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(quiz.quizId);
                              }}
                              className="menu-item"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(quiz.quizId);
                              }}
                              className="menu-item"
                            >
                              Share
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(quiz.quizId);
                              }}
                              className="menu-item text-danger"
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
          <div className="col-lg-6">
            <div className="quiz-preview rounded-4 p-5 sticky-top" style={{ top: '100px' }}>
              {selectedQuiz ? (
                <>
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="quiz-preview-indicator"></div>
                      <span className="small text-muted fw-bold">QUIZ PREVIEW</span>
                    </div>
                    <h3 className="fs-4 fw-bold text-dark mb-2">
                      <span className="text-primary">Take:</span> {selectedQuiz.title}
                    </h3>
                    <p className="text-muted small mb-4">
                      {selectedQuiz.description}
                    </p>
                  </div>

                  <div className="bg-white rounded-3 p-4 mb-4 questions-preview">
                    {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                      <div>
                        <h4 className="fw-bold text-dark mb-3">
                          Questions ({selectedQuiz.questions.length})
                        </h4>
                        {selectedQuiz.questions.map((q: any, index: number) => (
                          <div key={index} className="mb-2 pb-2" style={{ borderBottom: index < selectedQuiz.questions.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <p className="text-dark small mb-0">
                              {index + 1}. {q.questionText}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-5">
                        <p className="small">No questions yet</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTakeQuiz(selectedQuiz.quizId)}
                    className="btn btn-primary w-100 fw-semibold"
                  >
                    Take This Quiz →
                  </button>
                </>
              ) : (
                <div className="text-center py-5">
                  <h3 className="fw-bold text-dark mb-2">
                    No quiz selected
                  </h3>
                  <p className="text-muted small">
                    Create your first quiz to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content bg-white rounded-3 p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="fw-bold text-dark mb-2">
              Delete Quiz?
            </h3>
            <p className="text-muted small mb-4">
              Are you sure you want to delete this quiz? This action cannot be undone.
            </p>
            <div className="d-flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-outline-secondary flex-grow-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn btn-danger flex-grow-1"
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
