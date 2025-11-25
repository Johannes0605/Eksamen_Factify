import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './home/Home';
import DemoQuiz from './pages/DemoQuiz';
import Login from './components/Login';
import Register from './components/Register';
import QuizList from './components/QuizList';
import QuizForm from './components/QuizForm';
import TakeQuiz from './components/TakeQuiz';
import Layout from './shared/Layout';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/demo-quiz" element={<DemoQuiz />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-form" element={<QuizForm />} />
        <Route path="/quiz-form/:id" element={<QuizForm />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />
      </Routes>
    </Layout>
  );
};

export default App;
