import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';   // ➜ Added for routing

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ➜ Initialize navigate

  useEffect(() => {
    fetch('https://localhost:5001/api/Quiz')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching quizzes:', err);
        setError('Could not load quizzes');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const handleTakeQuiz = (quizId: number) => {
    navigate(`/take-quiz/${quizId}`); // ➜ Navigate to the quiz-taking page
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Available Quizzes</h1>
      <ul>
        {quizzes.map((quiz: any) => (
          <li key={quiz.quizId} style={{ marginBottom: '10px' }}>
            <strong>{quiz.title}</strong> - {quiz.description}
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handleTakeQuiz(quiz.quizId)}
            >
              Take Quiz
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
