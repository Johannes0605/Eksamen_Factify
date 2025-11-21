import { useEffect, useState } from 'react';

function HomePage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all quizzes from backend
    fetch(`${import.meta.env.VITE_API_URL}/api/quiz`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch quizzes');
        return res.json();
      })
      .then(data => {
        console.log('Fetched quizzes:', data);
        setQuizzes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const startQuiz = (quizId) => {
    // For now just log - you'll add routing later
    console.log('Starting quiz:', quizId);
    alert(`Starting quiz ${quizId}! (Add routing to navigate)`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading quizzes...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Error: {error}</h2>
        <p>Make sure the backend is running on https://localhost:5001</p>
        <p>Check browser console for details</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', color: '#2c3e50' }}>Factify Quiz App</h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          Test your knowledge with our awesome quizzes!
        </p>
      </header>

      {quizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No quizzes available yet</h2>
          <p>Check back later or seed the database!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {quizzes.map(quiz => (
            <div 
              key={quiz.quizId} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '10px',
                color: '#2c3e50'
              }}>
                {quiz.title}
              </h3>
              
              <p style={{ 
                color: '#7f8c8d', 
                marginBottom: '15px',
                minHeight: '40px'
              }}>
                {quiz.description}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ 
                  fontSize: '0.9rem',
                  color: '#95a5a6',
                  fontWeight: 'bold'
                }}>
                  📝 {quiz.questions?.length || 0} questions
                </span>
              </div>

              <button
                onClick={() => startQuiz(quiz.quizId)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2980b9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3498db';
                }}
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;