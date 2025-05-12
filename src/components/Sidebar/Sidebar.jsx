import React from "react";
import TradingViewWidget from "../Chart";
import TradingPlatform from "../TradingPlatform/TradingPlatform";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="widget-container">
        <TradingViewWidget />
        <TradingPlatform />
      </div>
    </div>
  );
};

export default Sidebar;
