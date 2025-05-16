import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef(null);
  const widgetId = "tradingview-widget"; // ID duy nhất để tránh lặp iframe

  useEffect(() => {
    // Xoá nội dung cũ trước khi thêm mới
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          ["OANDA:XAUUSD|1M"],
          ["BINANCE:BTCUSD|1M"],
          ["FX:EURUSD|1M"],
          ["FX_IDC:JPYUSD|1M"],
          ["BINANCE:ETHUSD|1M"]
        ],
        "chartOnly": false,
        "width": "100%",
        "height": "350",
        "locale": "vi_VN",
        "colorTheme": "light",
        "autosize": true,
        "showVolume": false,
        "hideDateRanges": false,
        "hideMarketStatus": false,
        "hideSymbolLogo": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "Trebuchet MS, Roboto, sans-serif",
        "fontSize": "12",
        "noTimeScale": false,
        "valuesTracking": "1",
        "changeMode": "price-and-percent",
        "chartType": "area",
        "lineWidth": 2,
        "lineType": 0
      }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      id={widgetId}
      ref={container}
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
