import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PartnersSection from "../components/Partners/Partners";
import Details from "./Details";
import TickerTape from "../components/Ticker";
import AOS from "aos";
import "aos/dist/aos.css";
import "./ArticleDetailsPage.css";

function ArticleDetailsPage() {
  const { topic, articleId } = useParams();
  console.log(topic, articleId)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="ticker">
        <TickerTape />
      </div>
      <main className="wrapper fade-in detail-wrapper">
        <div className="content-layout">
          <div className="content-main">
            <Details />
          </div>
        </div>
      </main>
      <PartnersSection />
      <Footer data-aos="fade-up" />
    </>
  );
}

export default ArticleDetailsPage;
