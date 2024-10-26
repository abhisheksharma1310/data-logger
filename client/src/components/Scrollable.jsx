import React from "react";

const Scrollable = ({ height, children }) => {
  return (
    <div
      style={{
        width: "100%",
        height: `calc(100vh - ${height})`,
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
};

export default Scrollable;
