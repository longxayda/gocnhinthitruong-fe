import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminAddArticle from "./pages/AdminAddArticles";
import AdminLogin from "./pages/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import ArticleDetail from "./pages/ArticleDetailsPage";
import Captcha from "./components/Captcha";

function App() {
  const [selectedTopic, setSelectedTopic] = useState("tintuc");

  return (
    <Router>
      <Routes>
        {/* Route không bị ảnh hưởng bởi CAPTCHA */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/add-articles"
          element={
            <PrivateRoute>
              <AdminAddArticle />
            </PrivateRoute>
          }
        />
        {/* Route được bọc bởi CAPTCHA */}
        <Route
          path="/"
          element={
            <Captcha>
              <Home
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
              />
            </Captcha>
          }
        />
        <Route
          path="/article/:articleId"
          element={
            <Captcha>
              <ArticleDetail />
            </Captcha>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
