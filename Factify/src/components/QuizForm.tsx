// src/components/QuizForm.tsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import { Quiz, Question, AnswerOption } from '../types/quiz.types';

interface QuizFormProps {
  quizId?: number;
  onSave: () => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ quizId, onSave, onCancel }) => {
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
      onSave();
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {quizId ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Question</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  + Add Question
                </button>
              </div>

              {quiz.questions?.map((question, qIndex) => (
                <div key={qIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-lg">Question {qIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Question text</label>
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Score</label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="1"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-700 font-semibold">Options</label>
                      <button
                        type="button"
                        onClick={() => addAnswerOption(qIndex)}
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        + Add Option
                      </button>
                    </div>

                    {question.answerOptions?.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={option.answerText}
                          onChange={(e) => updateAnswerOption(qIndex, oIndex, 'answerText', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded"
                          placeholder={`Alternativ ${oIndex + 1}`}
                          required
                        />
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => updateAnswerOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                            className="w-5 h-5"
                          />
                          <span className="text-sm">Right!</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeAnswerOption(qIndex, oIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Quiz'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
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