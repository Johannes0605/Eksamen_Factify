import { useEffect, useState } from "react";

function ItemListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // questionId -> optionId
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch("https://localhost:5001/api/Quiz")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
        setError("Could not load quizzes");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleOptionChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    let totalQuestions = 0;
    let correct = 0;

    quizzes.forEach((quiz) => {
      quiz.questions?.forEach((q) => {
        totalQuestions++;
        const selectedOptionId = answers[q.questionId];

        const selectedOption = q.options?.find(
          (opt) => opt.optionsId === selectedOptionId
        );

        if (selectedOption && selectedOption.isCorrect) {
          correct++;
        }
      });
    });

    setScore({ correct, totalQuestions });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Available Quizzes</h1>

      {quizzes.map((quiz) => (
        <div
          key={quiz.quizId}
          style={{
            border: "1px solid #ddd",
            marginBottom: "1rem",
            padding: "1rem",
          }}
        >
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>

          <h3>Questions</h3>
          {quiz.questions?.map((q) => (
            <div key={q.questionId} style={{ marginBottom: "0.75rem" }}>
              <strong>{q.questionText}</strong>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {q.options?.map((opt) => (
                  <li key={opt.optionsId}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${q.questionId}`}
                        value={opt.optionsId}
                        checked={answers[q.questionId] === opt.optionsId}
                        onChange={() =>
                          handleOptionChange(q.questionId, opt.optionsId)
                        }
                      />
                      {" "}
                      {opt.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem" }}>
        Submit quiz
      </button>

      {score && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          You got {score.correct} / {score.totalQuestions} correct.
        </p>
      )}
    </div>
  );
}

export default ItemListPage;
