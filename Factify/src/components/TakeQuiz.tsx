// src/components/TakeQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api.service';
import { Quiz, Question } from '../types/quiz.types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeQuiz.css';

interface TakeQuizProps {
  quizId?: number;
  onComplete?: () => void;
}

const TakeQuiz: React.FC<TakeQuizProps> = ({ quizId: propQuizId, onComplete }) => {
  const { id: paramId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const quizId = propQuizId || (paramId ? parseInt(paramId) : 0);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId && quizId > 0) {
      loadQuiz();
    }
  }, [quizId]);

  const loadQuiz = async () => {
    if (!quizId || quizId === 0) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiService.getQuizById(quizId);
      console.log('Raw quiz data from API:', data);

      // Transform backend data structure to match frontend types
      // Backend uses 'options' and 'text', frontend expects 'answerOptions' and 'answerText'
      const normalized = {
        ...data,
        questions: (data.questions || []).map((q: any) => {
          const normalizedQuestion = {
            questionId: q.questionId ?? 0,
            quizId: q.quizId ?? 0,
            questionText: q.questionText ?? '',
            points: q.points ?? 1,
            // Map backend 'options' to frontend 'answerOptions'
            answerOptions: (q.options || []).map((opt: any) => ({
              answerOptionId: opt.optionsId ?? 0,
              questionId: opt.questionId ?? q.questionId ?? 0,
              answerText: opt.text ?? '',
              isCorrect: opt.isCorrect ?? false
            }))
          };
          console.log('Normalized question:', normalizedQuestion);
          return normalizedQuestion;
        })
      } as Quiz;

      console.log('Final normalized quiz:', normalized);
      setQuiz(normalized);
    } catch (err) {
      console.error('Error loading quiz:', err);
      alert('Could not load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerOptionId: number) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answerOptionId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Calculate score locally for immediate feedback
    let calculatedScore = 0;
    let totalPoints = 0;

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      const selectedAnswerId = answers[index];
      const correctAnswer = question.answerOptions.find(opt => opt.isCorrect);
      
      if (selectedAnswerId === correctAnswer?.answerOptionId) {
        calculatedScore += question.points;
      }
    });

    setScore(calculatedScore);
    setShowResults(true);

    // Submit to backend for tracking (authenticated users only)
    if (isAuthenticated) {
      try {
        await apiService.submitQuizAttempt(quizId, { answers });
      } catch (err) {
        console.error('Could not save quiz attempt');
      }
    }
  };

  const handleBackHome = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/home');
    }
  };

  if (loading) {
    return (
      <div className="take-quiz-container d-flex align-items-center justify-content-center">
        <div className="fs-5 text-muted">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="take-quiz-container d-flex align-items-center justify-content-center">
        <div className="fs-5 text-danger">Quiz not found</div>
      </div>
    );
  }

  if (showResults) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;

    return (
      <div className="take-quiz-container d-flex align-items-center justify-content-center p-4">
        <div className="quiz-results-card bg-white rounded-4 p-5 text-center" style={{ maxWidth: '600px', width: '100%' }}>
          <h2 className="fs-1 fw-bold text-dark mb-4">
            Quiz Completed
          </h2>
          
          <div className="mb-4">
            <div className="results-score fw-bold mb-2">
              {score} / {totalPoints}
            </div>
            <div className="fs-4 text-muted">
              {percentage.toFixed(0)}%
            </div>
          </div>

          <div className="mb-5">
            {percentage >= 80 && (
              <p className="fs-5 text-success fw-semibold mb-0">Excellent performance!</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="fs-5 text-primary fw-semibold mb-0">Good job!</p>
            )}
            {percentage < 60 && (
              <p className="fs-5 text-warning fw-semibold mb-0">Keep practicing to improve</p>
            )}
          </div>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {isAuthenticated ? (
              <button
                onClick={handleBackHome}
                className="btn btn-primary px-4 fw-semibold"
              >
                Back to Home
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-primary px-4 fw-semibold"
                >
                  Create Account
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-outline-primary px-4 fw-semibold"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined;
  const allAnswered = quiz.questions.every((_, index) => answers[index] !== undefined);

  return (
    <div className="take-quiz-container d-flex align-items-start justify-content-center py-5" style={{ paddingTop: '80px' }}>
      <div className="quiz-card card border-0 shadow-lg rounded-4 w-100" style={{ maxWidth: '600px' }}>
        <div className="card-body p-5">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h3 fw-bold text-dark mb-2">
              {quiz.title}
            </h1>
            <p className="text-muted small mb-3">
              {quiz.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-semibold text-dark">
                  {currentQuestionIndex + 1}/{quiz.questions.length}
                </span>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-4">
            <h2 className="fs-5 fw-semibold text-dark mb-4" style={{ lineHeight: 1.6 }}>
              {currentQuestion.questionText}
            </h2>

            <div className="d-flex flex-column gap-3">
              {currentQuestion.answerOptions && currentQuestion.answerOptions.length > 0 ? (
                currentQuestion.answerOptions.map((option) => {
                  const isSelected = answers[currentQuestionIndex] === option.answerOptionId;
                  const isCorrect = option.isCorrect;
                  const answered = answers[currentQuestionIndex] !== undefined;
                  
                  // Determine button styling based on state
                  let borderColor = '#d1d5db';
                  let bgColor = '#ffffff';
                  let textColor = '#1e1919';
                  
                  if (answered) {
                    if (isCorrect) {
                      borderColor = '#10b981';
                      bgColor = '#f0fdf4';
                      textColor = '#10b981';
                    } else if (isSelected && !isCorrect) {
                      borderColor = '#ef4444';
                      bgColor = '#fef2f2';
                      textColor = '#ef4444';
                    }
                  } else if (isSelected) {
                    borderColor = '#0061fe';
                    bgColor = '#f0f7ff';
                    textColor = '#0061fe';
                  }
                  
                  return (
                    <button
                      key={option.answerOptionId}
                      onClick={() => !answered && handleAnswerSelect(option.answerOptionId)}
                      className="answer-option p-3 rounded-3 text-start d-flex align-items-center justify-content-between"
                      style={{
                        border: `2px solid ${borderColor}`,
                        backgroundColor: bgColor,
                        color: textColor,
                        fontWeight: isSelected || isCorrect ? 600 : 500,
                        fontSize: '15px',
                        cursor: answered ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: answered && !isCorrect && !isSelected ? 0.6 : 1
                      }}
                    >
                      <span>{option.answerText}</span>
                      {answered && (
                        <span style={{ marginLeft: '8px', fontSize: '18px' }}>
                          {isCorrect && '✓'}
                          {isSelected && !isCorrect && '✗'}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-danger fw-semibold small">
                  No options available for this question
                </div>
              )}
            </div>
          </div>

          {/* Navigation Button */}
          <div className="d-flex gap-3">
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="btn btn-primary flex-grow-1 fw-semibold rounded-pill"
                style={{
                  opacity: !isAnswered ? 0.5 : 1,
                  cursor: !isAnswered ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="btn btn-success flex-grow-1 fw-semibold rounded-pill"
                style={{
                  opacity: !allAnswered ? 0.5 : 1,
                  cursor: !allAnswered ? 'not-allowed' : 'pointer'
                }}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;