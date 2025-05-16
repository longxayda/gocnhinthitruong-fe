import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const topics = [
    { id: "tintuc", vi: "Tin tức" },
    { id: "batdongsan", vi: "Kiến thức BĐS" },
    { id: "phaply", vi: "Pháp lý" },
    { id: "trading", vi: "Kỹ thuật Trading" },
    { id: "antoanhocduong", vi: "An toàn học đường" },
  ];

  const handleTopicClick = (topicId) => {
    console.log(`Navigating to topic: ${topicId}`); // Debug topic được chọn
    navigate(`/?topic=${topicId}`); // Điều hướng về `/` với topic
    // Close mobile menu
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      });
      bsCollapse.hide();
    }
    setTimeout(() => {
      const articlesContainer = document.querySelector(".articles-container");
      if (articlesContainer) {
        articlesContainer.scrollIntoView({ behavior: "smooth" });
      }
    }, 200); // Chờ một chút để trang load trước khi cuộn
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-2"
      style={{ backgroundColor: "rgb(0, 0, 0)" }}
    >
      <div className="container-fluid px-4">
        <a className="navbar-brand me-auto" href="/">
          <img
            src="/images/GNTT.jpg"
            alt="Company Logo"
            style={{ height: "50px", objectFit: "contain", margin: "0" }}
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav d-flex align-items-center gap-3">
            {topics.map((topic) => (
              <li className="nav-item" key={topic.id}>
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleTopicClick(topic.id)}
                >
                  {topic.vi}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
