import React from "react";
import { Spin } from "antd";

const Loading = ({ isLoading = false }) => {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "50px",
        padding: "50px",
        display: `${isLoading ? "block" : "none"}`,
      }}
    >
      {isLoading && (
        <>
          Loading data...{" "}
          <Spin spinning={isLoading} percent={"auto"} delay="500" />
        </>
      )}
    </div>
  );
};

export default Loading;
