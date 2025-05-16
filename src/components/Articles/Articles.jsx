import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./Articles.css";

function Articles({ language }) {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]); // Dành cho tintuc từ API gocnhinthitruong
  const [localArticles, setLocalArticles] = useState({}); // Dành cho 4 topic từ localhost
  const [currentPage, setCurrentPage] = useState(0);
  const articlesContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy topic từ URL
  const queryParams = new URLSearchParams(location.search);
  const selectedTopic = queryParams.get("topic") || "tintuc"; // Mặc định 'tintuc'

  const topics = [
    { id: "tintuc", vi: "Tin tức", en: "News" },
    { id: "batdongsan", vi: "Kiến thức BĐS", en: "Real Estate Knowledge" },
    { id: "phaply", vi: "Pháp lý", en: "Legal" },
    { id: "trading", vi: "Kỹ thuật Trading", en: "Trading Techniques" },
    { id: "antoanhocduong", vi: "An toàn học đường", en: "School Safety" },
  ];

  const handleArticleClick = (articleId) => {
    if (articleId) {
      navigate(`/article/${articleId}`);
    }
  };

  // Fetch bài viết tintuc từ API gocnhinthitruong
  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const response = await axios.get(
          "https://api.gocnhinthitruong.com/api/articles/tintuc"
        );
        setAllArticles(response.data);
      } catch (error) {
        console.error("Lỗi tải bài viết tintuc:", error);
      }
    };
    fetchAllArticles();
  }, []);

  // Fetch bài viết từ localhost cho 4 topic còn lại
  useEffect(() => {
    const fetchLocalArticles = async () => {
      try {
        const localTopics = [
          "batdongsan",
          "phaply",
          "trading",
          "antoanhocduong",
        ];
        const promises = localTopics.map(async (topic) => {
          const response = await axios.get(
            `https://api.gocnhinthitruong.com/api/editor/articles/${topic}`
          );
          return { topic, data: response.data };
        });
        const results = await Promise.all(promises);
        const articlesByTopic = results.reduce((acc, { topic, data }) => {
          acc[topic] = data;
          return acc;
        }, {});
        setLocalArticles(articlesByTopic);
      } catch (error) {
        console.error("Lỗi tải bài viết từ localhost:", error);
      }
    };
    fetchLocalArticles();
  }, []);

  // Fetch danh sách bài viết theo selectedTopic
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let apiUrl;
        let response;
        if (selectedTopic === "tintuc") {
          apiUrl = `https://api.gocnhinthitruong.com/api/articles/${selectedTopic}`;
          console.log(`Fetching from: ${apiUrl}`);
          response = await axios.get(apiUrl);
        } else {
          apiUrl = `https://api.gocnhinthitruong.com/api/editor/articles/${selectedTopic}`;
          console.log(`Fetching from: ${apiUrl}`);
          response = await axios.get(apiUrl);
        }
        console.log("API response:", response.data);
        setArticles(response.data);
        setCurrentPage(0);
      } catch (error) {
        console.error(
          "Lỗi tải bài viết:",
          error.response?.data || error.message
        );
      }
    };
    fetchArticles();
  }, [selectedTopic]);

  const articlesPerPage = 16;
  const totalPages = Math.ceil((articles.length - 1) / articlesPerPage);
  const startIndex = currentPage * articlesPerPage + 1;
  const currentArticles = articles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    articlesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    articlesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
    articlesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`page-btn ${currentPage === i ? "active" : ""}`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      if (currentPage > 1) {
        pages.push(
          <button
            key={0}
            onClick={() => handlePageClick(0)}
            className="page-btn"
          >
            1
          </button>
        );
        if (currentPage > 2) {
          pages.push(<span key="start-ellipsis">...</span>);
        }
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`page-btn ${currentPage === i ? "active" : ""}`}
          >
            {i + 1}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis">...</span>);
      }

      if (currentPage < totalPages - 1) {
        pages.push(
          <button
            key={totalPages - 1}
            onClick={() => handlePageClick(totalPages - 1)}
            className="page-btn"
          >
            {totalPages}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="articles-wrapper">
      <h1
        className="section-title"
        style={{
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          backgroundColor: "rgb(0, 0, 0)",
        }}
      >
        🔥TIN NỔI BẬT🔥
      </h1>

      {/* GRID 4x2 */}
      <div className="articles-grid">
        {/* Bài viết lớn cho tintuc từ API gocnhinthitruong */}
        {allArticles.length > 0 && (
          <div
            className="grid-item large"
            onClick={() => handleArticleClick(allArticles[0]?.id)}
          >
            <img
              src={allArticles[0]?.thumbnail || ""}
              alt="Thumbnail"
              onError={(e) => (e.target.src = "/images/replace_error.jfif")}
            />
            <div className="overlay">
              <h2>{allArticles[0]?.title || ""}</h2>
            </div>
          </div>
        )}

        {/* 4 bài viết nhỏ từ localhost */}
        {topics.slice(1, 5).map((topic, index) => {
          const topicArticles = localArticles[topic.id] || [];
          return (
            topicArticles.length > 0 && (
              <div
                key={index}
                className="grid-item small"
                onClick={() => handleArticleClick(topicArticles[0]?.id)}
              >
                <img
                  src={topicArticles[0]?.thumbnail || ""}
                  alt={topicArticles[0]?.title || ""}
                  onError={(e) => (e.target.src = "/images/replace_error.jfif")}
                />
                <div className="overlay">
                  <h3>{topicArticles[0]?.title || ""}</h3>
                </div>
              </div>
            )
          );
        })}
      </div>

      {/* DANH SÁCH BÀI VIẾT THEO TOPIC */}
      <div className="articles-container" ref={articlesContainerRef}>
        <div className="articles-main">
          <h1 className="section-title">Các bài viết liên quan</h1>
          {currentArticles.map((article, index) => (
            <div
              key={index}
              className="article-row"
              onClick={() => handleArticleClick(article.id)}
            >
              <img
                src={article.thumbnail}
                alt={article.title}
                className="article-thumb"
                onError={(e) => (e.target.src = "/images/replace_error.jfif")}
              />
              <div className="article-info">
                <h5 className="article-title">{article.title}</h5>
                <p className="article-date">
                  {new Date(article.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {/* PHÂN TRANG */}
          <div className="pagination-container">
            {currentPage > 0 && (
              <button onClick={handlePrev} className="page-btn">
                «
              </button>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages - 1 && (
              <button onClick={handleNext} className="page-btn">
                »
              </button>
            )}
          </div>
        </div>
        <div style={{}}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default Articles;
