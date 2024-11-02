import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { JsonToTable } from "react-json-to-table";
import { Button, Select, Switch } from "antd";
import Json2Chart from "../Json2Chart/Json2Chart";
import Scrollable from "../Scrollable";

const dataTypeOptions = [
  {
    value: "json",
    label: "JSON",
  },
  {
    value: "raw",
    label: "RAW",
  },
];

const viewTypeOptions = [
  {
    value: "table",
    label: "TABLE",
  },
  {
    value: "chart",
    label: "CHART",
  },
];

const showTimeOptions = [
  {
    value: "yes",
    label: "YES",
  },
  {
    value: "no",
    label: "NO",
  },
];

const isValidJson = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

const localTime = (timestamp) => {
  const utcDate = new Date(timestamp);
  return utcDate.toLocaleString();
};

const DataViewer = ({ serialData }) => {
  const [dataType, setDataType] = useState("json");
  const [viewType, setViewType] = useState("table");
  const [showTime, setShowTime] = useState("yes");

  const jsonData = useMemo(() => {
    if (dataType === "json") {
      return serialData
        .filter(({ timestamp, data }) => isValidJson(data))
        .map(({ timestamp, data }) => {
          return showTime === "yes"
            ? { timestamp: localTime(timestamp), ...JSON.parse(data) }
            : { ...JSON.parse(data) };
        });
    } else if (dataType === "raw") {
      if (showTime === "no") {
        return serialData.map(({ timestamp, data }) => {
          return { data };
        });
      } else {
        return serialData;
      }
    }
  }, [dataType, serialData, showTime]);

  return (
    <div>
      <div>
        <h3 style={{ display: "inline", paddingRight: "10px" }}>Data Type</h3>
        <Select
          defaultValue="json"
          style={{
            width: 100,
          }}
          onChange={(e) => setDataType(e)}
          options={dataTypeOptions}
        />
        <h3 style={{ display: "inline", padding: "0 10px" }}>View Type</h3>
        <Select
          defaultValue="table"
          style={{
            width: 100,
          }}
          onChange={(e) => setViewType(e)}
          options={viewTypeOptions}
        />
        <h3 style={{ display: "inline", padding: "0 10px" }}>Timestamp</h3>
        <Select
          defaultValue="Yes"
          style={{
            width: 90,
          }}
          onChange={(e) => setShowTime(e)}
          options={showTimeOptions}
        />
      </div>

      <div style={{ margin: "10px 0" }}>
        <Scrollable height={"320px"}>
          {viewType === "table" && <JsonToTable json={jsonData} />}
          {viewType === "chart" && <Json2Chart jsonData={jsonData} />}
        </Scrollable>
      </div>
    </div>
  );
};

DataViewer.propTypes = {
  jsonData: PropTypes.any.isRequired,
};

export default DataViewer;
