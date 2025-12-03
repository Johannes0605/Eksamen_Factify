// src/components/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.css";

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
    <div className="landing-page-wrapper" style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', padding: '80px 24px' }}>
      <div className="landing-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        
        {/* Left Side - Text Content */}
        <div className="landing-content">
          <h1 className="landing-title" style={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            lineHeight: 1.2,
            marginBottom: '24px',
            color: '#ffffffff'
          }}>
            Create and share
            <br />
            <span style={{ color: '#28cdffff' }}>your own quizzes</span>
          </h1>

          <p className="fs-5 mb-4 lh-lg" style={{ maxWidth: '500px', color: '#ffffff' }}>
            Create interactive quizzes with Factify, test knowledge, 
            and track your progress. Build quizzes in minutes and share them with your team or students.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="btn btn-lg mb-3"
            style={{ backgroundColor: '#ffffff', color: '#1e40af', border: 'none', fontWeight: 600 }}
          >
            Get Started →
          </button>

          <p className="small" style={{ color: '#ffffff' }}>
            Already have an account? <a href="/login" className="fw-bold text-decoration-none" style={{ color: '#28cdffff' }}>Sign in</a>
          </p>
        </div>

        {/* Right Side - Interactive Demo Quiz */}
        <div>
          <div className="card shadow-lg border-light rounded-4 quiz-card">
              <div className="card-body p-5">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small fw-bold text-muted">
                      {showResult ? 'COMPLETED' : `${currentQuestion + 1}/${sampleQuiz.questions.length}`}
                    </span>
                  </div>
                  <h2 className="card-title h4 fw-bold mb-2">
                    {sampleQuiz.title}
                  </h2>
                  <p className="card-text small text-muted">
                    Try this interactive sample quiz
                  </p>
                </div>

                {!showResult ? (
                  <>
                    <div className="bg-light rounded-3 p-4 mb-4">
                      <p className="fw-semibold mb-4 lh-base">
                        {sampleQuiz.questions[currentQuestion].text}
                      </p>

                      <div className="d-flex flex-column gap-3">
                        {sampleQuiz.questions[currentQuestion].options.map((option, index) => {
                          const isCorrect = index === sampleQuiz.questions[currentQuestion].correctAnswer;
                          const isSelected = selectedAnswer === index;
                          const showFeedback = answered;
                          
                          let buttonClass = 'btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center';
                          
                          if (showFeedback) {
                            if (isSelected) {
                              buttonClass = isCorrect 
                                ? 'btn btn-outline-success w-100 text-start d-flex justify-content-between align-items-center border-2'
                                : 'btn btn-outline-danger w-100 text-start d-flex justify-content-between align-items-center border-2';
                            } else if (isCorrect) {
                              buttonClass = 'btn btn-outline-success w-100 text-start d-flex justify-content-between align-items-center';
                            }
                          } else if (isSelected) {
                            buttonClass = 'btn btn-outline-primary w-100 text-start d-flex justify-content-between align-items-center border-2';
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              disabled={answered}
                              className={buttonClass}
                            >
                              <span>{option}</span>
                              <span>
                                {showFeedback && isCorrect && '✓'}
                                {showFeedback && isSelected && !isCorrect && '✗'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={!answered}
                      className="btn btn-primary w-100"
                    >
                      {currentQuestion < sampleQuiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                    </button>
                  </>
                ) : (
                  <div className="bg-light rounded-3 p-5 text-center">
                    <h3 className="fw-bold mb-3">
                      Quiz Completed!
                    </h3>
                    <p className="display-5 fw-bold text-primary mb-3">
                      {score} / {sampleQuiz.questions.length}
                    </p>
                    <p className="small text-muted mb-4">
                      {score === sampleQuiz.questions.length 
                        ? 'Perfect score!' 
                        : score >= sampleQuiz.questions.length / 2 
                          ? 'Great job!' 
                          : 'Keep practicing!'}
                    </p>
                    <button
                      onClick={resetQuiz}
                      className="btn btn-outline-primary"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LandingPage;

