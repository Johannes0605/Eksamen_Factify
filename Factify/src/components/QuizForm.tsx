// src/components/QuizForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import { Quiz, Question, AnswerOption } from '../types/quiz.types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuizForm.css';

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
      
      // Normalize the quiz data to match frontend structure
      const normalizedQuiz = {
        ...data,
        questions: (data.questions || []).map((q: any) => ({
          questionId: q.questionId || 0,
          quizId: q.quizId || 0,
          questionText: q.questionText || '',
          points: q.points || 1,
          answerOptions: (q.options || []).map((opt: any) => ({
            answerOptionId: opt.optionsId || 0,
            questionId: opt.questionId || q.questionId || 0,
            answerText: opt.text || '',
            isCorrect: opt.isCorrect || false
          }))
        }))
      };
      
      console.log('Normalized quiz data:', normalizedQuiz);
      setQuiz(normalizedQuiz);
    } catch (err) {
      setError('Could not load quiz');
      console.error('Error loading quiz:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert frontend format to backend format
      const backendQuiz: any = {
        quizId: quiz.quizId,
        title: quiz.title,
        description: quiz.description,
        questions: (quiz.questions || []).map((q: any) => ({
          questionId: q.questionId || 0,
          quizId: q.quizId || 0,
          questionText: q.questionText,
          options: (q.answerOptions || []).map((opt: any) => ({
            optionsId: opt.answerOptionId || 0,
            questionId: q.questionId || 0,
            text: opt.answerText,
            isCorrect: opt.isCorrect
          }))
        }))
      };

      if (quizId) {
        await apiService.updateQuiz(quizId, backendQuiz);
      } else {
        await apiService.createQuiz(backendQuiz);
      }
      
      if (onSave) {
        onSave();
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError('Could not save quiz');
      console.error('Error saving quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Partial<Question> = {
      questionId: 0,
      questionText: '',
      points: 1,
      answerOptions: [
        { answerOptionId: 0, questionId: 0, answerText: '', isCorrect: false } as AnswerOption,
        { answerOptionId: 0, questionId: 0, answerText: '', isCorrect: false } as AnswerOption
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
    const questionId = questions[questionIndex].questionId || 0;
    const newOption: AnswerOption = {
      answerOptionId: 0,
      questionId: questionId,
      answerText: '',
      isCorrect: false
    };
    if (!questions[questionIndex].answerOptions) {
      questions[questionIndex].answerOptions = [];
    }
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
    <div className="quiz-form-container d-flex align-items-start justify-content-center py-5" style={{ paddingTop: '80px' }}>
      <div className="quiz-form-card card border-0 shadow-lg rounded-4 w-100" style={{ maxWidth: '800px' }}>
        <div className="card-body p-5">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="h2 fw-bold text-dark mb-2">
              {quizId ? 'Edit Your Quiz' : 'Create New Quiz'}
            </h1>
            <p className="text-muted small mb-3">
              {quizId ? 'Update quiz details and questions' : 'Build an engaging quiz with custom questions and answers'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Quiz Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Quiz Title</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-pill quiz-input"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Enter an engaging title for your quiz"
                required
              />
            </div>

            {/* Quiz Description */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control quiz-input"
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                rows={3}
                placeholder="Describe what your quiz is about"
              />
            </div>

            {/* Questions Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold text-dark mb-0">
                  Questions ({quiz.questions?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn btn-success btn-sm rounded-pill"
                >
                  + Add Question
                </button>
              </div>

              {quiz.questions?.length === 0 ? (
                <div className="bg-light rounded-3 p-4 text-center border border-2 border-dashed border-secondary-subtle">
                  <p className="fw-semibold mb-1">No questions yet</p>
                  <p className="text-muted small mb-0">Click the button above to create your first question</p>
                </div>
              ) : (
                quiz.questions?.map((question, qIndex) => (
                  <div 
                    key={qIndex}
                    className="bg-light rounded-3 p-4 mb-3 border"
                  >
                    {/* Question Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span
                        className="badge bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 700 }}
                      >
                        {qIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="btn btn-outline-danger btn-sm rounded-pill"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Question Text Input */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Question Text</label>
                      <input
                        type="text"
                        className="form-control quiz-input"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    {/* Answer Options */}
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label small fw-semibold mb-0">
                          Answer Options ({question.answerOptions?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => addAnswerOption(qIndex)}
                          className="btn btn-primary btn-sm rounded-pill"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        {(question.answerOptions && question.answerOptions.length > 0) ? (
                          question.answerOptions.map((option, oIndex) => (
                            <div 
                              key={oIndex}
                              className="d-flex align-items-center gap-2 bg-white p-2 rounded-2 border border-light"
                            >
                              <input
                                type="text"
                                className="form-control form-control-sm quiz-input"
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
                                  Correct
                                </label>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeAnswerOption(qIndex, oIndex)}
                                className="btn btn-outline-danger btn-sm rounded-pill"
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center p-3 text-muted">
                            <p className="mb-0 small">No options yet. Click "Add Option" to create one.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form Actions */}
            <div className="d-flex gap-3 pt-4 border-top mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-grow-1 rounded-pill fw-semibold"
              >
                {loading ? 'Saving...' : 'Save Quiz'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    navigate('/home');
                  }
                }}
                className="btn btn-outline-secondary flex-grow-1 rounded-pill fw-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;