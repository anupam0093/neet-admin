import React from "react";

const Loading = () => {
  return (
    <div className="loading-container">
      <svg className="circle-svg" height="200" width="200">
        <circle cx="100" cy="100" r="50"></circle>
      </svg>
    </div>
  );
};
export default Loading;
