// src/components/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [answered, setAnswered] = React.useState(false);

  // Sample quiz data
  const sampleQuiz = {
    title: "Quick Knowledge Check",
    questions: [
      {
        text: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 1
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2
      },
      {
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1
      }
    ]
  };

  const handleAnswerSelect = (index: number) => {
    if (answered) return; // Prevent changing answer after selection
    
    setSelectedAnswer(index);
    setAnswered(true);
    
    // Check if answer is correct
    if (index === sampleQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  // Redirect authenticated users to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#ffffff', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        
        {/* Left Side - Text Content */}
        <div>

          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            lineHeight: 1.2,
            marginBottom: '24px',
            color: '#1e1919'
          }}>
            Create & Share
            <br />
            <span style={{ color: '#0061fe' }}>Engaging Quizzes</span>
          </h1>

          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6b7280', 
            lineHeight: 1.7,
            marginBottom: '32px',
            maxWidth: '500px'
          }}>
            Factify empowers you to create interactive quizzes, test knowledge, 
            and track progress. Build quizzes in minutes and share them with your team or students.
          </p>

          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: '#0061fe',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px rgba(0, 97, 254, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052d9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0061fe'}
          >
            Get Started Free →
          </button>

          <p style={{ 
            fontSize: '0.875rem', 
            color: '#9ca3af', 
            marginTop: '16px'
          }}>
            Already have an account? <a href="/login" style={{ color: '#0061fe', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
          </p>
        </div>

        {/* Right Side - Interactive Demo Quiz */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></div>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>LIVE DEMO</span>
              </div>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>
                {showResult ? 'COMPLETED' : `${currentQuestion + 1}/${sampleQuiz.questions.length}`}
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
              {sampleQuiz.title}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Try this interactive sample quiz
            </p>
          </div>

          {!showResult ? (
            <div style={{ 
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: '#1e1919',
                marginBottom: '20px',
                lineHeight: 1.5
              }}>
                {sampleQuiz.questions[currentQuestion].text}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sampleQuiz.questions[currentQuestion].options.map((option, index) => {
                  const isCorrect = index === sampleQuiz.questions[currentQuestion].correctAnswer;
                  const isSelected = selectedAnswer === index;
                  const showFeedback = answered;
                  
                  let backgroundColor = '#ffffff';
                  let borderColor = '#e5e7eb';
                  let textColor = '#1e1919';
                  
                  if (showFeedback) {
                    if (isSelected) {
                      if (isCorrect) {
                        backgroundColor = '#dcfce7';
                        borderColor = '#22c55e';
                        textColor = '#16a34a';
                      } else {
                        backgroundColor = '#fee2e2';
                        borderColor = '#ef4444';
                        textColor = '#dc2626';
                      }
                    } else if (isCorrect) {
                      backgroundColor = '#dcfce7';
                      borderColor = '#22c55e';
                      textColor = '#16a34a';
                    }
                  } else if (isSelected) {
                    backgroundColor = '#f0f7ff';
                    borderColor = '#0061fe';
                    textColor = '#0061fe';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={answered}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '8px',
                        border: `2px solid ${borderColor}`,
                        backgroundColor: backgroundColor,
                        color: textColor,
                        fontSize: '14px',
                        fontWeight: isSelected || (showFeedback && isCorrect) ? 600 : 500,
                        cursor: answered ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (!answered && !isSelected) {
                          e.currentTarget.style.borderColor = '#0061fe';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!answered && !isSelected) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      <span>{option}</span>
                      {showFeedback && isCorrect && <span>✓</span>}
                      {showFeedback && isSelected && !isCorrect && <span>✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1919', marginBottom: '8px' }}>
                Quiz Completed!
              </h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0061fe', marginBottom: '12px' }}>
                {score} / {sampleQuiz.questions.length}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '20px' }}>
                {score === sampleQuiz.questions.length 
                  ? 'Perfect score!' 
                  : score >= sampleQuiz.questions.length / 2 
                    ? 'Great job!' 
                    : 'Keep practicing!'}
              </p>
              <button
                onClick={resetQuiz}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '2px solid #0061fe',
                  backgroundColor: '#ffffff',
                  color: '#0061fe',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0061fe';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#0061fe';
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!showResult && (
            <button
              onClick={handleNext}
              disabled={!answered}
              style={{
                width: '100%',
                backgroundColor: answered ? '#0061fe' : '#e5e7eb',
                color: answered ? '#ffffff' : '#9ca3af',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: answered ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (answered) {
                  e.currentTarget.style.backgroundColor = '#0052d9';
                }
              }}
              onMouseLeave={(e) => {
                if (answered) {
                  e.currentTarget.style.backgroundColor = '#0061fe';
                }
              }}
            >
              {currentQuestion < sampleQuiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

