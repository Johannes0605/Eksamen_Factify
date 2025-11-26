// src/components/TakeQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import { Quiz, Question } from '../types/quiz.types';

interface TakeQuizProps {
  quizId?: number;
  onComplete?: () => void;
}

const TakeQuiz: React.FC<TakeQuizProps> = ({ quizId: propQuizId, onComplete }) => {
  const { id: paramId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
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

      // Normalize backend shape to frontend expected shape:
      // backend may return question.options with optionsId/text, while frontend expects question.answerOptions with answerOptionId/answerText
      const normalized = {
        ...data,
        questions: (data.questions || []).map((q: any) => ({
          questionId: q.questionId ?? q.questionId ?? 0,
          questionText: q.questionText ?? q.questionText ?? q.text ?? '',
          points: q.points ?? 1,
          answerOptions: (q.answerOptions && q.answerOptions.length) ? q.answerOptions.map((ao: any) => ({
            answerOptionId: ao.answerOptionId ?? ao.optionsId ?? ao.id,
            answerText: ao.answerText ?? ao.text ?? '',
            isCorrect: ao.isCorrect ?? ao.correct ?? false
          })) : (q.options || []).map((opt: any) => ({
            answerOptionId: opt.optionsId ?? opt.answerOptionId ?? opt.id,
            answerText: opt.text ?? opt.answerText ?? '',
            isCorrect: opt.isCorrect ?? opt.correct ?? false
          }))
        }))
      } as Quiz;

      setQuiz(normalized);
    } catch (err) {
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

    try {
      await apiService.submitQuizAttempt(quizId, { answers });
    } catch (err) {
      console.error('Could not save quiz attempt');
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
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' }}>
        <div style={{ fontSize: '1.5rem', color: '#dc3545' }}>Quiz not found</div>
      </div>
    );
  }

  if (showResults) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;

    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', padding: '24px' }}>
        <div className="bg-light-custom rounded-xl p-5 border border-light-custom text-center" style={{ maxWidth: '600px', width: '100%' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e1919', marginBottom: '24px' }}>
            Quiz Completed
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#0061fe', marginBottom: '8px' }}>
              {score} / {totalPoints}
            </div>
            <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>
              {percentage.toFixed(0)}%
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            {percentage >= 80 && (
              <p style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 600, marginBottom: 0 }}>Excellent performance!</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p style={{ fontSize: '1.25rem', color: '#0061fe', fontWeight: 600, marginBottom: 0 }}>Good job!</p>
            )}
            {percentage < 60 && (
              <p style={{ fontSize: '1.25rem', color: '#f59e0b', fontWeight: 600, marginBottom: 0 }}>Keep practicing to improve</p>
            )}
          </div>

          <button
            onClick={handleBackHome}
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 600 }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined;
  const allAnswered = quiz.questions.every((_, index) => answers[index] !== undefined);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
            {quiz.title}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: 0 }}>
            {quiz.description}
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e1919' }}>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {currentQuestion.points} points
            </span>
          </div>
          <div className="progress" style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e5e7eb' }}>
            <div
              className="progress-bar"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                backgroundColor: '#0061fe',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #e5e7eb',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1e1919',
            marginBottom: '24px',
            lineHeight: 1.6
          }}>
            {currentQuestion.questionText}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestion.answerOptions.map((option) => {
              const isSelected = answers[currentQuestionIndex] === option.answerOptionId;
              
              return (
                <button
                  key={option.answerOptionId}
                  onClick={() => handleAnswerSelect(option.answerOptionId)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#0061fe' : '#d1d5db'}`,
                    backgroundColor: isSelected ? '#f0f7ff' : '#ffffff',
                    color: isSelected ? '#0061fe' : '#1e1919',
                    fontSize: '15px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#0061fe';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {option.answerText}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline-secondary flex-grow-1"
            style={{
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn btn-success flex-grow-1"
              style={{
                opacity: !allAnswered ? 0.5 : 1,
                cursor: !allAnswered ? 'not-allowed' : 'pointer'
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="btn btn-primary flex-grow-1"
              style={{
                opacity: !isAnswered ? 0.5 : 1,
                cursor: !isAnswered ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          )}
        </div>

        {/* Question Dots */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentQuestionIndex ? '#0061fe' : answers[index] !== undefined ? '#10b981' : '#e5e7eb',
                color: index === currentQuestionIndex || answers[index] !== undefined ? '#ffffff' : '#6b7280',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;