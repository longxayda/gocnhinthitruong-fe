import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./Articles.css";

const FeaturedArticleCard = ({ articles = [], handleArticleClick }) => {
  const featuredArticle = articles[1] || articles[0];

  if (!featuredArticle) return null; // Không có article để render

  return (
    <div
      className="topic-article-featured"
      onClick={() => handleArticleClick?.(featuredArticle.id)}
    >
      <img
        src={featuredArticle.thumbnail}
        alt={featuredArticle.title}
        style={{
          width: "100%",
          height: 220,
          objectFit: "cover",
          background: "#eee",
        }}
        onError={(e) => (e.target.src = "/images/replace_error.jfif")}
      />
      <div style={{ padding: 20 }}>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: "0 0 10px 0",
            color: "#222",
          }}
        >
          {featuredArticle.title}
        </h3>
        <div
          style={{
            fontSize: 14,
            color: "#888",
            marginBottom: 8,
          }}
        >
          {featuredArticle.date
            ? new Date(featuredArticle.date).toLocaleDateString()
            : ""}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "#444",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            minHeight: 60,
          }}
        >
          {featuredArticle.description || ""}
        </div>
      </div>
    </div>
  );
};

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
  const selectedTopic = queryParams.get("topic") || "phaply";

  const topics = [
    { id: "tintuc", vi: "Tin tức", en: "News" },
    { id: "batdongsan", vi: "Kiến thức BĐS", en: "Real Estate Knowledge" },
    { id: "quantridn", vi: "Quản trị DN", en: "Business Administration" },
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
  const currentArticles = allArticles.slice(
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
        {localArticles["phaply"]?.length > 0 && (
          <div
            className="grid-item large"
            onClick={() => handleArticleClick(localArticles["phaply"][0]?.id)}
          >
            <img
              src={localArticles["phaply"][0]?.thumbnail || ""}
              alt="Thumbnail"
              onError={(e) => (e.target.src = "/images/replace_error.jfif")}
            />
            <div className="overlay">
              <h2>{localArticles["phaply"][0]?.title || ""}</h2>
            </div>
          </div>
        )}

        {/* 4 bài viết nhỏ: tintuc, batdongsan, trading, antoanhocduong */}
        {["batdongsan", "antoanhocduong", "trading", "tintuc"].map(
          (topicId, index) => {
            const topicData =
              topicId === "tintuc" ? allArticles : localArticles[topicId];
            return (
              topicData?.length > 0 && (
                <div
                  key={index}
                  className="grid-item small"
                  onClick={() => handleArticleClick(topicData[0]?.id)}
                >
                  <img
                    src={topicData[0]?.thumbnail || ""}
                    alt={topicData[0]?.title || ""}
                    onError={(e) =>
                      (e.target.src = "/images/replace_error.jfif")
                    }
                  />
                  <div className="overlay">
                    <h3>{topicData[0]?.title || ""}</h3>
                  </div>
                </div>
              )
            );
          }
        )}
      </div>

      {/* SECTION: Bài viết theo chủ đề */}
      <div className="topic-section">
        {/* Navigation Bar */}
        <div className="topic-navbar">
          <div className="topic-navbar-title">Bài viết liên quan</div>
          <div className="topic-navbar-list">
            {[
              { id: "phaply", label: "Quản trị Doanh nghiệp" },
              { id: "batdongsan", label: "Kiến thức BĐS" },
              { id: "antoanhocduong", label: "An Toàn Học Đường" },
              { id: "trading", label: "Kỹ Thuật Trading" },
            ].map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  params.set("topic", topic.id);
                  navigate({ search: params.toString() });
                }}
                style={{
                  background: selectedTopic === topic.id ? "#fff" : "#fff",
                  color: selectedTopic === topic.id ? "#111" : "#d4d4d4",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 18px",
                  fontWeight: 500,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Row */}
        <div className="topic-articles-row">
          {/* First column: newest/most impressive article */}
          <FeaturedArticleCard
            articles={articles}
            handleArticleClick={handleArticleClick}
          />
          {/* Second column: list of remaining articles */}
          <div
            className="topic-article-list"
          >
            {articles[0] &&
              [articles[0], ...articles.slice(2, 5)].map((article) => (
                <div
                  key={article.id}
                  className="topic-article-item"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    style={{
                      width: 210,
                      height: 105,
                      objectFit: "cover",
                      background: "#eee",
                      flexShrink: 0,
                    }}
                    onError={(e) =>
                      (e.target.src = "/images/replace_error.jfif")
                    }
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#222",
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: 'justify'
                      }}
                    >
                      {article.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#888",
                      }}
                    >
                      {article.date
                        ? new Date(article.date).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT THEO TOPIC */}
      <div className="articles-container" ref={articlesContainerRef}>
        <div className="articles-main">
          <h3
            style={{ fontSize: "20px", fontWeight: "700" }}
            className="section-title"
          >
            Tin tức thị trường
          </h3>
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
