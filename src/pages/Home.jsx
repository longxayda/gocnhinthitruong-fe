import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Articles from "../components/Articles/Articles";
import Loading from "../components/Loading/Loading";
import PartnersSection from "../components/Partners/Partners";
import TickerTape from "../components/Ticker";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const [selectedTopic, setSelectedTopic] = useState("tintuc");
  const [language, setLanguage] = useState("vi");
  const [articles, setArticles] = useState([]);
  const [editorArticles, setEditorArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languageLoading, setLanguageLoading] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 3000); // Đảm bảo loading tối thiểu 2 giây
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.init({
        duration: 800,
        once: false,
        mirror: true,
      });
    }
  }, [loading]);

  // Lấy dữ liệu từ SQLite
  useEffect(() => {
    setLoading(true);
    // api script
    fetch(`https://api.gocnhinthitruong.com/api/articles`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi tải bài viết script:", error);
        setLoading(false);
      });

    // api editor
    fetch(`https://api.gocnhinthitruong.com/api/articles`)
      .then((response) => response.json())
      .then((data) => {
        setEditorArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi tải bài viết editor:", error);
        setLoading(false);
      });
  }, [selectedTopic]);

  const handleLanguageToggle = () => {
    setLanguageLoading(true);
    setTimeout(() => {
      setLanguage((prev) => (prev === "vi" ? "en" : "vi"));
      setLanguageLoading(false);
    }, 1500);
  };

  const slogan = {
    vi: "“Nơi kết nối sức mạnh công nghệ và giá trị nhân văn”",
    en: "“Where technology power meets human values”",
  };

  return (
    <>
      {(loading || languageLoading) && <Loading />}
      <div className={loading || languageLoading ? "d-none" : ""}>
        <Navbar
          setSelectedTopic={setSelectedTopic}
          selectedTopic={selectedTopic}
          language={language}
          onToggleLanguage={handleLanguageToggle}
        />

        <div className="ticker">
          <TickerTape />
        </div>
        <main className="wrapper fade-in">
          <section
            id="articles"
            className="articles-section"
            data-aos="fade-up"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.17)",
            }}
          >
            <Articles
              articles={articles}
              language={language}
              selectedTopic={selectedTopic}
            />
          </section>
        </main>

        <PartnersSection language={language} />
        <Footer language={language} data-aos="fade-up" />
      </div>
    </>
  );
}

export default Home;
