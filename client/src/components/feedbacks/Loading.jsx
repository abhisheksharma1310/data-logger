import React from "react";
import { Spin } from "antd";

const Loading = ({ isLoading = false, isFetching = false }) => {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "50px",
        padding: "50px",
        display: `${isLoading || isFetching ? "block" : "none"}`,
      }}
    >
      {isFetching && (
        <>
          Fetching data...{" "}
          <Spin spinning={isFetching} percent={"auto"} delay="500" />
        </>
      )}
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
