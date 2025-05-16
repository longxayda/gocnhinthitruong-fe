import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Component CAPTCHA để xác minh người dùng và hiển thị tuyên bố miễn trừ
function Captcha({ children }) {
  // Trạng thái cho checkbox CAPTCHA và tuyên bố miễn trừ
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);
  // Trạng thái kiểm tra CAPTCHA đã hoàn thành chưa
  const [isCaptchaCompleted, setIsCaptchaCompleted] = useState(
    sessionStorage.getItem("captchaCompleted") === "true"
  );
  const location = useLocation();

  // Bỏ qua CAPTCHA cho route /admin/login
  const isAdminLoginRoute = location.pathname === "/admin/login";

  // Theo dõi thay đổi route để kiểm tra trạng thái CAPTCHA
  useEffect(() => {
    if (isCaptchaCompleted || isAdminLoginRoute) return;
    if (!sessionStorage.getItem("captchaCompleted")) {
      setIsCaptchaCompleted(false);
    }
  }, [location, isCaptchaCompleted, isAdminLoginRoute]);

  // Xử lý khi người dùng nhấn nút xác nhận
  const handleSubmit = () => {
    if (isRobotChecked && isDisclaimerChecked) {
      sessionStorage.setItem("captchaCompleted", "true");
      setIsCaptchaCompleted(true);
    }
  };

  // Nếu CAPTCHA đã hoàn thành hoặc ở route /admin/login, hiển thị nội dung ứng dụng
  if (isCaptchaCompleted || isAdminLoginRoute) {
    return children;
  }

  // CSS inline cho modal và các thành phần
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "left",
  };

  const checkboxContainerStyle = {
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
  };

  const buttonStyle = {
    backgroundColor:
      isRobotChecked && isDisclaimerChecked ? "#007bff" : "#cccccc",
    color: "#ffffff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: isRobotChecked && isDisclaimerChecked ? "pointer" : "not-allowed",
    width: "100%",
    fontSize: "1rem",
  };

  return (
    <div
      style={modalStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="captcha-title"
    >
      <div style={modalContentStyle}>
        <h2
          id="captcha-title"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Xác minh và Tuyên bố Miễn trừ trách nhiệm
        </h2>
        <div style={checkboxContainerStyle}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isRobotChecked}
              onChange={(e) => setIsRobotChecked(e.target.checked)}
              style={{ marginRight: "8px" }}
              aria-label="Xác minh tôi không phải robot"
            />
            <span>Tôi không phải là robot</span>
          </label>
        </div>
        <div style={checkboxContainerStyle}>
          <div
            style={{
              textAlign: "justify",
              borderTop: "1px solid black",
              paddingTop: "5%",
            }}
          >
            <p style={{ fontSize: "0.875rem", marginBottom: "8px" }}>
              <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Thông tin được
              cung cấp trên trang web này chỉ nhằm mục đích tham khảo. Chúng tôi
              không bảo đảm tính chính xác, đầy đủ hoặc kịp thời của các nội
              dung và sẽ không chịu trách nhiệm đối với bất kỳ tổn thất hoặc
              thiệt hại nào phát sinh từ việc sử dụng các thông tin này, dù dưới
              bất kỳ hình thức nào.
            </p>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={isDisclaimerChecked}
                onChange={(e) => setIsDisclaimerChecked(e.target.checked)}
                style={{ marginRight: "8px" }}
                aria-label="Đồng ý với tuyên bố miễn trừ trách nhiệm"
              />
              <span>Tôi đồng ý với tuyên bố miễn trừ trách nhiệm</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isRobotChecked || !isDisclaimerChecked}
          style={buttonStyle}
          aria-disabled={!isRobotChecked || !isDisclaimerChecked}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}

export default Captcha;
