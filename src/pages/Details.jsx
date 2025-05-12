import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import axios from "axios";
import "./Details.css";

function Details() {
  const [searchParams] = useSearchParams();
  const highlightText = searchParams.get("highlight");
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [additionalData, setAdditionalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const topics = [
    { id: "tintuc", vi: "Tin tức" },
    { id: "batdongsan", vi: "Kiến thức BĐS" },
    { id: "phaply", vi: "Pháp lý" },
    { id: "trading", vi: "Kỹ thuật Trading" },
    { id: "antoanhocduong", vi: "An toàn học đường" },
  ];

  const highlightContent = (content, keyword) => { 
    if (!keyword) return content;
    const regex = new RegExp(`(${keyword})`, "i");
    return content.replace(regex, `<span id="highlighted-text" class="highlight">$1</span>`); 
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch từ cả 2 API song song
  //       const [localResponse, apiResponse] = await Promise.all([
  //         axios.get(`https://api.gocnhinthitruong.com/api/editor/article/${articleId}`),
  //         axios.get(`https://api.gocnhinthitruong.com/api/article/${articleId}`)
  //       ]);

  //       // Kết hợp dữ liệu từ cả 2 nguồn
  //       const combinedData = {
  //         ...localResponse.data,
  //         ...apiResponse.data,
  //         // Nếu có trường nào cần ưu tiên từ nguồn cụ thể, có thể chỉ định rõ
  //         thumbnail: localResponse.data.thumbnail || apiResponse.data.thumbnail,
  //         title: localResponse.data.title || apiResponse.data.title,
  //         date: localResponse.data.date || apiResponse.data.date,
  //         summary: localResponse.data.summary || apiResponse.data.summary,
  //         link: localResponse.data.link || apiResponse.data.link,
  //         topic: localResponse.data.topic || apiResponse.data.topic
  //       };
  //       console.log("---------------- OMBINED DATA", combinedData);

  //       setArticle(combinedData);
  //       setAdditionalData(apiResponse.data); // Lưu dữ liệu bổ sung nếu cần

  //     } catch (error) {
  //       console.error("Lỗi tải dữ liệu:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [articleId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Bắt đầu fetch API local...");
        const localResponse = await axios.get(`https://api.gocnhinthitruong.com/api/editor/article/${articleId}`);
        console.log("API local response:", localResponse.data);
        setArticle(localResponse.data);
      } catch (error) {
        console.error("Lỗi fetch API local:", error.message);
      }
  
      try {
        console.log("Bắt đầu fetch API gocnhinthitruong...");
        const apiResponse = await axios.get(`https://api.gocnhinthitruong.com/api/article/${articleId}`);
        console.log("API gocnhinthitruong response:", apiResponse.data);
  
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
  if (!article) return <p className="error">Không tìm thấy bài viết.</p>;

  return (
    <>
      <div className="entry-crumbs" style={{
        backgroundColor: '#000',
        padding: '20px',
      }}>
        <Link to="/" className="crumb-home">Trang chủ</Link>&nbsp;&gt;
        <Link to={`/?topic=${article.topic}`} className="crumb-topic" onClick={handleNavigateAndScroll(article.topic)}>
          {getTopicName(article.topic)}
        </Link>&gt;&nbsp;
        <span className="crumb-title">{article.title}</span>
      </div>
      <div className="details-container">
        <div className="article-detail">
          <img
            className="thumbnail"
            src={article.thumbnail}
            alt={article.title}
            onError={(e) => (e.target.src = "/images/replace_error.jfif")}
          />
          <h1 className="title">{article.title}</h1>
          <p className="date">🕒 {new Date(article.date).toLocaleDateString("vi-VN")}</p>
          <p 
            className="summary" 
            dangerouslySetInnerHTML={{ 
              __html: highlightContent(article.summary, highlightText), 
            }} 
          />
          <a href={article.link} className="article-link" target="_blank" rel="noopener noreferrer">
            Xem chi tiết: → {article.link}
          </a>
        </div>
        <Sidebar/>
      </div>
    </>
  );
}

export default Details;