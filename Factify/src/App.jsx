import { Routes, Route } from "react-router-dom";
import HomePage from "./home/HomePage.jsx";
import ItemListPage from "./items/ItemListPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quizzes" element={<ItemListPage />} />
    </Routes>
  );
}

export default App;
