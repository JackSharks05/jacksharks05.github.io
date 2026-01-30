import React from "react";
import "./ContentSection.css";

const ContentSection = ({ id, title, isActive, onClose, children }) => {
  return (
    <div className={`content-section ${isActive ? "active" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        ✕
      </button>
      <div className="content-inner">
        <h1>{title}</h1>
        <div className="section-content">{children}</div>
      </div>
    </div>
  );
};

export default ContentSection;
