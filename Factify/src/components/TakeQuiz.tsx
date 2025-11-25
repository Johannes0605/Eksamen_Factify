// src/components/TakeQuiz.tsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import { Quiz, Question } from '../types/quiz.types';

interface TakeQuizProps {
  quizId: number;
  onComplete: () => void;
}

const TakeQuiz: React.FC<TakeQuizProps> = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-red-600">Quiz not found</div>
      </div>
    );
  }

  if (showResults) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Quiz completed</h2>
          
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {score} / {totalPoints}
            </div>
            <div className="text-2xl text-gray-600">
              {percentage.toFixed(0)}%
            </div>
          </div>

          <div className="mb-6">
            {percentage >= 80 && (
              <p className="text-2xl text-green-600 font-semibold">Excellent!</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="text-2xl text-blue-600 font-semibold">Good job!</p>
            )}
            {percentage < 60 && (
              <p className="text-2xl text-orange-600 font-semibold">Keep practising! 💪</p>
            )}
          </div>

          <button
            onClick={onComplete}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined;
  const allAnswered = quiz.questions.every((_, index) => answers[index] !== undefined);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">
                Question {currentQuestionIndex + 1} av {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {currentQuestion.points} Score
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-3">
              {currentQuestion.answerOptions.map((option) => (
                <button
                  key={option.answerOptionId}
                  onClick={() => handleAnswerSelect(option.answerOptionId)}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestionIndex] === option.answerOptionId
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {option.answerText}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ← Previous question
            </button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-8 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next one →
              </button>
            )}
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;