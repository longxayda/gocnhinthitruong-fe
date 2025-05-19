import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Component CAPTCHA để hiển thị bảng thông báo và yêu cầu xác minh
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
    if (isAdminLoginRoute) {
      setIsCaptchaCompleted(true);
      return;
    }
    if (sessionStorage.getItem("captchaCompleted") === "true") {
      setIsCaptchaCompleted(true);
    } else {
      setIsCaptchaCompleted(false);
    }
  }, [location, isAdminLoginRoute]);

  // Xử lý khi người dùng nhấn nút xác nhận
  const handleSubmit = () => {
    if (isRobotChecked && isDisclaimerChecked) {
      sessionStorage.setItem("captchaCompleted", "true");
      setIsCaptchaCompleted(true);
    }
  };

  // CSS inline cho modal và các thành phần
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isCaptchaCompleted || isAdminLoginRoute ? "none" : "flex",
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

  const checkboxStyle = {
    width: "30px",
    height: "30px",
    marginRight: "15px",
  };

  const contentWrapperStyle = {
    pointerEvents: isCaptchaCompleted || isAdminLoginRoute ? "auto" : "none",
    filter: isCaptchaCompleted || isAdminLoginRoute ? "none" : "blur(2px)",
  };

  return (
    <div>
      {/* Nội dung trang con luôn được render */}
      <div style={contentWrapperStyle}>{children}</div>

      {/* Modal CAPTCHA hiển thị nếu chưa hoàn thành */}
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
                style={checkboxStyle}
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
                <strong>
                  <u>Tuyên bố miễn trừ trách nhiệm:</u>
                </strong>{" "}
                Thông tin trên trang web này chỉ mang tính chất tham khảo và không
                cấu thành lời khuyên pháp lý, tài chính, y tế hoặc chuyên môn. Mặc
                dù chúng tôi nỗ lực đảm bảo độ chính xác và cập nhật, không có cam
                kết nào về tính đầy đủ, kịp thời hoặc phù hợp của nội dung đối với
                mục đích cụ thể. Người dùng tự chịu trách nhiệm với mọi quyết định
                hoặc hành động dựa trên thông tin tại đây. Chúng tôi không chịu
                trách nhiệm cho bất kỳ tổn thất hay thiệt hại nào phát sinh, dù
                trực tiếp hay gián tiếp, từ việc sử dụng thông tin trên trang. Vui
                lòng tham vấn luật sư hoặc chuyên gia phù hợp trước khi đưa ra các
                quyết định quan trọng. Việc sử dụng trang đồng nghĩa với việc bạn
                đồng ý với tuyên bố miễn trừ trách nhiệm này.
              </p>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={isDisclaimerChecked}
                  onChange={(e) => setIsDisclaimerChecked(e.target.checked)}
                  style={checkboxStyle}
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
    </div>
  );
}

export default Captcha;