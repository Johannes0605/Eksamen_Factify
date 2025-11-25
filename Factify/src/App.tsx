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
        <Route path="/quiz-list" element={<QuizList onSelectQuiz={() => {}} onCreateNew={() => {}} onTakeQuiz={() => {}} />} />
        <Route path="/quiz-form/:id?" element={<QuizForm onSave={() => {}} onCancel={() => {}} />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz onComplete={() => {}} quizId={0} />} />
      </Routes>
    </Layout>
  );
};

export default App;


