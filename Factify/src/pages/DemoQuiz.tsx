
import { useEffect, useState } from "react";
import apiService from "../services/api.service";
import TakeQuiz from "../components/TakeQuiz";

const DemoQuizPage = () => {
  const [demoQuizId, setDemoQuizId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const quizzes = await apiService.getPublicQuizzes();
        if (quizzes && quizzes.length > 0) {
          setDemoQuizId(quizzes[0].quizId);
        } else {
          setError('Ingen demo-quiz funnet');
        }
      } catch (err) {
        setError('Kunne ikke laste demo-quiz');
      }
    };
    load();
  }, []);

  return (
    <>
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Demo Quiz</h2>
        {error && <p>{error}</p>}
        {!error && demoQuizId === null && <p>Laster demo...</p>}
        {demoQuizId !== null && (
          <div style={{ marginTop: 20 }}>
            <TakeQuiz quizId={demoQuizId} onComplete={() => window.location.href = '/'} />
          </div>
        )}
      </div>
    </>
  );
};

export default DemoQuizPage;
