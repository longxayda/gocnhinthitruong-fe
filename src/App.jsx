import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminAddArticle from './pages/AdminAddArticles';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/PrivateRoute';
import ArticleDetail from './pages/ArticleDetailsPage';

function App() {
  const [selectedTopic, setSelectedTopic] = useState("tintuc");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/article/:articleId" element={<ArticleDetail />} />
        <Route
          path="/admin/add-articles"
          element={
            <PrivateRoute>
              <AdminAddArticle />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
