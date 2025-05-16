function Footer({ language }) {
  const contactInfo = {
    vi: {
      copyright: "© 2024 Power5 Technology. All rights reserved.",
      contact: "Liên hệ",
      email: "Email",
      phone: "Điện thoại",
      emailValue: "service@power5.edu.vn",
      phoneValue: "(+84) 907 303 646",
    },
    en: {
      copyright: "© 2024 Power5 Technology. All rights reserved.",
      contact: "Contact",
      email: "Email",
      phone: "Phone",
      emailValue: "service@power5.edu.vn",
      phoneValue: "(+84) 907 303 646",
    },
  };

  const text = contactInfo[language];

  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-0">
          <div className="mb-0">
            <img src="/images/jlf_logo.png" style={{ width: "100px" }}></img>
          </div>
        </div>
        <div>
          <p>
            Địa chỉ: Tòa nhà 7A-9-11, đường 12, KP 37, Bình Chiểu, Thủ Đức, HCM
          </p>
          {"Hotline"}: {"(+84) 933157568"}
        </div>
        <div className="contact-info text-center text-md-end">
          <p className="mb-0">
            <strong>{"Website"}:</strong> <br />
            <strong>
              <a
                href="https://justivalaw.com/"
                style={{ textDecoration: "none" }}
                target="_blank"
              >
                CÔNG TY LUẬT TNHH JUSTIVA LAW
              </a>
            </strong>{" "}
            <br />
            <strong>{"Liên hệ"}:</strong> <br />
            {"Email"}: {"justivalaw@gmail.com"} <br />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
