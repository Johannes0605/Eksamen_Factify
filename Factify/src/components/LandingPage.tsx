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
    <div className="landing-page-container min-vh-100 bg-white py-5">
      <div className="container-lg">
        <div className="row g-5 align-items-center">
          
          {/* Left Side - Text Content */}
          <div className="col-lg-6">
            <h1 className="display-3 fw-bold mb-4 landing-title">
              Create & Share
              <br />
              <span className="text-primary">Your own Quizzes</span>
            </h1>

            <p className="fs-5 text-muted mb-4 lh-lg" style={{ maxWidth: '500px' }}>
              Create interactive quizzes with Factify, test knowledge, 
              and track your progress. Build quizzes in minutes and share them with your team or students.
            </p>

            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary btn-lg mb-3"
            >
              Get Started →
            </button>

            <p className="small text-secondary">
              Already have an account? <a href="/login" className="text-primary fw-bold text-decoration-none">Sign in</a>
            </p>
          </div>

          {/* Right Side - Interactive Demo Quiz */}
          <div className="col-lg-6">
            <div className="card shadow-lg border-light rounded-4 quiz-card">
              <div className="card-body p-5">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success">●</span>
                      <span className="small fw-bold text-muted">LIVE DEMO</span>
                    </div>
                    <span className="small fw-bold text-muted">
                      {showResult ? 'COMPLETED' : `${currentQuestion + 1}/${sampleQuiz.questions.length}`}
                    </span>
                  </div>
                  <h3 className="card-title h4 fw-bold mb-2">
                    {sampleQuiz.title}
                  </h3>
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
                    <h4 className="fw-bold mb-3">
                      Quiz Completed!
                    </h4>
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
    </div>
  );
};

export default LandingPage;

