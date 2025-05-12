import React from "react";
import "./TradingPlatform.css";

const platforms = [
  { name: "Binance", logo: "/images/icon-binance.png", link: "https://www.binance.com/en" },
  { name: "Exness", logo: "/images/exness.jfif", link: "https://www.exness.global/" },
  { name: "Mexc", logo: "/images/mexc-global.webp", link: "https://www.mexc.com/" },
  { name: "Bitget", logo: "/images/bitget.png", link: "https://www.bitget.com/" },
  { name: "Coinex", logo: "/images/coinex.webp", link: "https://www.coinex.com/en/" },
  { name: "HTX", logo: "/images/htx.jpg", link: "https://www.htx.com.cm/" },
  { name: "Gate", logo: "/images/icon-gate.png", link: "https://www.gate.io/" },
  { name: "Hashkey", logo: "/images/hashkey.png", link: "https://global.hashkey.com/en-US/" },
];

const TradingPlatform = () => {
  return (
    <div className="trading-platform">
      <h3>Những sàn giao dịch tiền điện tử tốt nhất hiện nay</h3>
      <ul>
        {platforms.map((platform, index) => (
          <li key={index} className="platform-item">
            <img src={platform.logo} alt={platform.name} />
            <span>{platform.name}</span>
            <a href={platform.link}>Xem →</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradingPlatform;
