import { useState, useEffect, memo } from "react";
import Marquee from "react-fast-marquee";
import "./ticker.css";

// API lấy danh sách coin với logo
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

function TickerTape() {
    const [tickerData, setTickerData] = useState([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                // Lọc ra những đồng coin cần hiển thị
                const selectedCoins = ["bitcoin", "ethereum", "tether", "xrp", "bnb", "solana", "usdc", "cardano", "dogecoin", "tron"];
                const filteredData = data
                    .filter(coin => selectedCoins.includes(coin.id))
                    .map(coin => ({
                        id: coin.id, // Thêm id để tạo link
                        title: coin.name,
                        price: `$${coin.current_price.toLocaleString()}`,
                        change: `${coin.price_change_percentage_24h.toFixed(2)}%`,
                        icon: coin.image, // URL logo
                        color: coin.price_change_percentage_24h >= 0 ? "#28a745" : "#dc3545"
                    }));

                setTickerData(filteredData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 10000); // Cập nhật mỗi 10 giây

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ticker-container">
            <Marquee speed={60} gradient={true} gradientWidth={50}>
                {tickerData.map((item, index) => (
                    <a key={index} className="ticker-item" href={`https://www.coingecko.com/en/coins/${item.id}`} target="_blank" rel="noopener noreferrer" style={{ borderColor: item.color }}>
                        <img src={item.icon} alt={item.title} className="ticker-icon" />
                        <span className="ticker-title">{item.title}</span>
                        <span className="ticker-price">{item.price}</span>
                        <span className={`ticker-change ${item.change.startsWith("-") ? "down" : "up"}`}>
                            {item.change}
                        </span>
                    </a>
                ))}
            </Marquee>
        </div>
    );
}

export default memo(TickerTape);
