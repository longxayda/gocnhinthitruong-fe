import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import axios from "axios";
import "./Details.css";

function Details() {
  const [searchParams] = useSearchParams();
  const [relatedArticles, setRelatedArticles] = useState([]);
  const highlightText = searchParams.get("highlight");
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [correctTopic, setCorrectTopic] = useState('');
  const [correctArticle, setCorrectArticle] = useState(null);
  const [additionalData, setAdditionalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const topics = [
    { id: "tintuc", vi: "Tin tức" },
    { id: "batdongsan", vi: "Kiến thức BĐS" },
    { id: "phaply", vi: "Quản trị DN" },
    { id: "trading", vi: "Kỹ thuật Trading" },
    { id: "antoanhocduong", vi: "An toàn học đường" },
  ];

  const highlightContent = (content, keyword) => {
    if (!keyword) return content;
    const regex = new RegExp(`(${keyword})`, "i");
    return content.replace(regex, `<span id="highlighted-text" class="highlight">$1</span>`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Bắt đầu fetch API local...");
        const localResponse = await axios.get(`https://api.gocnhinthitruong.com/api/editor/article/${articleId}`);
        setArticle(localResponse.data);
      } catch (error) {
        console.error("Lỗi fetch API local:", error.message);
      }

      try {
        console.log("Bắt đầu fetch API gocnhinthitruong...");
        const apiResponse = await axios.get(`https://api.gocnhinthitruong.com/api/article/${articleId}`);

        setArticle(prevArticle => ({
          ...prevArticle,
          ...apiResponse.data,
          thumbnail: prevArticle?.thumbnail || apiResponse.data.thumbnail,
          title: prevArticle?.title || apiResponse.data.title,
          date: prevArticle?.date || apiResponse.data.date,
          summary: prevArticle?.summary || apiResponse.data.summary,
          link: prevArticle?.link || apiResponse.data.link,
          topic: prevArticle?.topic || apiResponse.data.topic
        }));

        setAdditionalData(apiResponse.data);
      } catch (error) {
        console.error("Lỗi fetch API gocnhinthitruong:", error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [articleId]);

  useEffect(() => {
    if (article && article.topic) {
      setCorrectTopic(article.topic);
    }
  }, [article])

  useEffect(() => {
    if (!correctTopic) return;
    const fetchCorrectArticle = async () => {
      try {
        const res = await axios.get(`https://api.gocnhinthitruong.com/api/articles/${correctTopic}/${articleId}`);
        setCorrectArticle(res.data);
        console.log("CORRECT ARTICLE RES:", res.data);
      } catch (error) {
        console.error("Lỗi fetch Correct topic:", error.message);
      }
    }
    fetchCorrectArticle();
  }, [correctTopic, articleId])


  useEffect(() => {
  if (!correctTopic) return;
  const fetchRelatedArticles = async () => {
    try {
      const res = await axios.get(`https://api.gocnhinthitruong.com/api/articles/${correctTopic}`);
      const filtered = res.data.filter((item) => item._id !== articleId);
      setRelatedArticles(filtered.slice(0, 5)); // giới hạn 5 bài viết
    } catch (error) {
      console.error("Lỗi fetch bài viết cùng chủ đề:", error.message);
    }
  };
  fetchRelatedArticles();
}, [correctTopic, articleId]);

  useEffect(() => {
    if (!loading && highlightText) {
      setTimeout(() => {
        const highlightedElement = document.getElementById("highlighted-text");
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [loading, highlightText]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const detailsContainer = document.querySelector(".detail-wrapper");
        if (detailsContainer) {
          detailsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [loading]);
  const getTopicName = (topicId) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic ? topic.vi : topicId;
  };

  const handleNavigateAndScroll = (topic) => (event) => {
    event.preventDefault();
    navigate(`/?topic=${topic}`);
    setTimeout(() => {
      const articlesContainer = document.querySelector(".articles-container");
      if (articlesContainer) {
        articlesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  if (loading) return <p className="loading">Đang tải bài viết...</p>;
  if (!article || !correctArticle) return <p className="error">Không tìm thấy bài viết.</p>;
  const finalLink = correctArticle.topic === "phaply"
    ? "https://justivalaw.com"
    : correctArticle.link === ""
      ? "/"
      : correctArticle.link;
  return (
    <>
      <div className="entry-crumbs" style={{
        backgroundColor: '#000',
        padding: '20px',
      }}>
        <Link to="/" className="crumb-home">Trang chủ</Link>&nbsp;&gt;
        <Link to={`/?topic=${correctArticle.topic}`} className="crumb-topic" onClick={handleNavigateAndScroll(correctArticle.topic)}>
          {getTopicName(correctArticle.topic)}
        </Link>&gt;&nbsp;
        <span className="crumb-title">{correctArticle.title}</span>
      </div>
      <div className="details-container">
        <div className="article-detail">
          <img
            className="thumbnail"
            src={correctArticle.thumbnail}
            alt={correctArticle.title}
            onError={(e) => (e.target.src = "/images/replace_error.jfif")}
          />
          <h1 className="title">{correctArticle.title}</h1>
          <p className="date">🕒 {new Date(correctArticle.date).toLocaleDateString("vi-VN")}</p>
          <p
            className="summary"
            dangerouslySetInnerHTML={{
              __html: highlightContent(correctArticle.summary, highlightText),
            }}
          />
          <a href={finalLink} className="article-link" target="_blank" rel="noopener noreferrer">
            Xem chi tiết: → {finalLink}
          </a>
        </div>
        <Sidebar />
      </div>
    </>
  );
}

export default Details;