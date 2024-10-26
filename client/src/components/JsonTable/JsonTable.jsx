import React, { useState } from "react";
import PropTypes from "prop-types";
import { JsonToTable } from "react-json-to-table";
import { Switch } from "antd";
import Json2Chart from "../Json2Chart/Json2Chart";

const JsonTable = ({ jsonData }) => {
  const [dataType, setDataType] = useState("Table");
  const isValidJson = (data) => {
    try {
      JSON.parse(JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      {isValidJson(jsonData) ? (
        <>
          <div>
            <Switch
              title="View data as"
              checkedChildren="Table"
              unCheckedChildren="Chart"
              defaultChecked
              onChange={(checked) =>
                checked ? setDataType("Table") : setDataType("Chart")
              }
            />
          </div>
          {dataType === "Table" && <JsonToTable json={jsonData} />}
          {dataType === "Chart" && <Json2Chart jsonData={jsonData} />}
        </>
      ) : (
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      )}
    </div>
  );
};

JsonTable.propTypes = {
  jsonData: PropTypes.any.isRequired,
};

export default JsonTable;
