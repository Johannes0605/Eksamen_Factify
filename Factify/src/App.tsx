import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './shared/Layout';

// Lazy load components to reduce initial bundle size
const LandingPage = lazy(() => import('./components/LandingPage'));
const Home = lazy(() => import('./home/Home'));
const DemoQuiz = lazy(() => import('./pages/DemoQuiz'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const QuizForm = lazy(() => import('./components/QuizForm'));
const TakeQuiz = lazy(() => import('./components/TakeQuiz'));

// Loading fallback
const Loading = () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

const App: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo-quiz" element={<DemoQuiz />} />
          <Route path="/quiz-form" element={<QuizForm />} />
          <Route path="/quiz-form/:id" element={<QuizForm />} />
          <Route path="/take-quiz/:id" element={<TakeQuiz />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
