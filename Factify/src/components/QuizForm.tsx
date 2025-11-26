// src/components/QuizForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import { Quiz, Question, AnswerOption } from '../types/quiz.types';

interface QuizFormProps {
  quizId?: number;
  onSave?: () => void;
  onCancel?: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ quizId: propQuizId, onSave, onCancel }) => {
  const { id: paramId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const quizId = propQuizId || (paramId ? parseInt(paramId) : undefined);
  
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    questions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const data = await apiService.getQuizById(quizId!);
      setQuiz(data);
    } catch (err) {
      setError('Could not load quiz');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (quizId) {
        await apiService.updateQuiz(quizId, quiz as Quiz);
      } else {
        await apiService.createQuiz(quiz as Omit<Quiz, 'quizId'>);
      }
      
      if (onSave) {
        onSave();
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError('Could not save quiz');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Partial<Question> = {
      questionText: '',
      points: 1,
      answerOptions: [
        { answerText: '', isCorrect: false } as AnswerOption,
        { answerText: '', isCorrect: false } as AnswerOption
      ]
    };
    setQuiz({
      ...quiz,
      questions: [...(quiz.questions || []), newQuestion as Question]
    });
  };

  const removeQuestion = (index: number) => {
    const questions = [...(quiz.questions || [])];
    questions.splice(index, 1);
    setQuiz({ ...quiz, questions });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const questions = [...(quiz.questions || [])];
    questions[index] = { ...questions[index], [field]: value };
    setQuiz({ ...quiz, questions });
  };

  const addAnswerOption = (questionIndex: number) => {
    const questions = [...(quiz.questions || [])];
    const newOption: AnswerOption = {
      answerOptionId: 0,
      questionId: questions[questionIndex].questionId,
      answerText: '',
      isCorrect: false
    };
    questions[questionIndex].answerOptions.push(newOption);
    setQuiz({ ...quiz, questions });
  };

  const removeAnswerOption = (questionIndex: number, optionIndex: number) => {
    const questions = [...(quiz.questions || [])];
    questions[questionIndex].answerOptions.splice(optionIndex, 1);
    setQuiz({ ...quiz, questions });
  };

  const updateAnswerOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const questions = [...(quiz.questions || [])];
    questions[questionIndex].answerOptions[optionIndex] = {
      ...questions[questionIndex].answerOptions[optionIndex],
      [field]: value
    };
    setQuiz({ ...quiz, questions });
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="container">
        
        {/* Header Section */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--bs-primary)' }}></div>
            <span className="text-secondary-custom fw-semibold small">QUIZ BUILDER</span>
          </div>
          <h1 className="display-5 fw-bold text-dark-custom mb-2">
            {quizId ? 'Edit Your Quiz' : 'Create New Quiz'}
          </h1>
          <p className="lead text-secondary-custom">
            {quizId ? 'Update quiz details and questions' : 'Build an engaging quiz with custom questions and answers'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <span className="me-2">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-light-custom rounded-xl p-5 border border-light-custom shadow-sm-custom">
          <form onSubmit={handleSubmit}>
            
            {/* Quiz Title */}
            <div className="mb-4">
              <label className="form-label">Quiz Title</label>
              <input
                type="text"
                className="form-control"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Enter an engaging title for your quiz"
                required
              />
            </div>

            {/* Quiz Description */}
            <div className="mb-4">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                rows={3}
                placeholder="Describe what your quiz is about"
              />
            </div>

            {/* Questions Section */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark-custom mb-0">
                  Questions ({quiz.questions?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn btn-success"
                >
                  + Add Question
                </button>
              </div>

              {quiz.questions?.length === 0 ? (
                <div className="bg-white rounded p-5 text-center border border-2 border-dashed border-light-custom">
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>❓</div>
                  <p className="text-secondary-custom fw-semibold mb-1">No questions yet</p>
                  <p className="text-secondary small">Click the button above to create your first question</p>
                </div>
              ) : (
                quiz.questions?.map((question, qIndex) => (
                  <div 
                    key={qIndex}
                    className="bg-white rounded-lg p-4 mb-3 border border-light-custom"
                  >
                    {/* Question Header */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <span
                          className="badge bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 700 }}
                        >
                          {qIndex + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Remove Question
                      </button>
                    </div>

                    {/* Question Text Input */}
                    <div className="mb-4">
                      <label className="form-label small fw-semibold">Question Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    {/* Question Points */}
                    <div className="mb-4">
                      <label className="form-label small fw-semibold">Points</label>
                      <input
                        type="number"
                        className="form-control"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>

                    {/* Answer Options */}
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="form-label small fw-semibold mb-0">
                          Answer Options ({question.answerOptions?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => addAnswerOption(qIndex)}
                          className="btn btn-primary btn-sm"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {question.answerOptions?.map((option, oIndex) => (
                          <div 
                            key={oIndex}
                            className="d-flex align-items-center gap-3 bg-light-custom p-3 rounded-lg border border-light-custom"
                          >
                            <input
                              type="text"
                              className="form-control"
                              value={option.answerText}
                              onChange={(e) => updateAnswerOption(qIndex, oIndex, 'answerText', e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                            
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`correct-${qIndex}-${oIndex}`}
                                checked={option.isCorrect}
                                onChange={(e) => updateAnswerOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                              />
                              <label 
                                className="form-check-label fw-semibold small text-nowrap"
                                htmlFor={`correct-${qIndex}-${oIndex}`}
                                style={{ color: option.isCorrect ? 'var(--bs-success)' : 'var(--bs-secondary)', cursor: 'pointer' }}
                              >
                                ✓ Correct
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeAnswerOption(qIndex, oIndex)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form Actions */}
            <div className="row g-3 pt-4 border-top border-light-custom">
              <div className="col-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  {loading ? '⏳ Saving...' : '💾 Save Quiz'}
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => {
                    if (onCancel) {
                      onCancel();
                    } else {
                      navigate('/home');
                    }
                  }}
                  className="btn btn-outline-secondary w-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;