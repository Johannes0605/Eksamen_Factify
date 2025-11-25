// src/components/QuizList.tsx
import React, { useEffect, useState } from 'react';
import apiService from '../services/api.service';
import { Quiz } from '../types/quiz.types';

interface QuizListProps {
  onSelectQuiz: (quizId: number) => void;
  onCreateNew: () => void;
  onTakeQuiz: (quizId: number) => void;
}

const QuizList: React.FC<QuizListProps> = ({ onSelectQuiz, onCreateNew, onTakeQuiz }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await apiService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError('Could not load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await apiService.deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.quizId !== id));
    } catch (err) {
      alert('Could not delete quiz');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Factify</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Quizzes</h2>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            + Create New Quiz
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No quizzes yet, make a new one!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div key={quiz.quizId} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-4">{quiz.description || 'Ingen beskrivelse'}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {quiz.questions?.length || 0} questions
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onTakeQuiz(quiz.quizId)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => onSelectQuiz(quiz.quizId)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.quizId)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;