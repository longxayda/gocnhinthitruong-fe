import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading-overlay">
      <img
        src="/images/GNTT-loading.png"
        alt="Loading..."
        className="loading-image"
      />
    </div>
  );
}

export default Loading;