import { Table } from "antd";
import React from "react";

const LogTable = ({ logType, dbLogs, fileLogs, columns }) => {
  return (
    <div>
      {logType === "db" && dbLogs?.length > 0 && (
        <Table columns={columns} dataSource={dbLogs} />
      )}
      {logType !== "db" && fileLogs?.length > 0 && (
        <Table columns={columns} dataSource={fileLogs} />
      )}
    </div>
  );
};

export default LogTable;
