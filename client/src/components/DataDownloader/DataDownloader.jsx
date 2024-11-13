import React, { useState } from "react";
import { Button, Select } from "antd";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const { Option } = Select;

const DataDownloader = ({ jsonData }) => {
  const [format, setFormat] = useState("json");

  const handleFormatChange = (value) => {
    setFormat(value);
  };

  const handleDownload = () => {
    switch (format) {
      case "json":
        downloadJSON();
        break;
      case "txt":
        downloadTXT();
        break;
      case "doc":
        downloadDOC();
        break;
      case "xlsx":
        downloadXLSX();
        break;
      case "pdf":
        downloadPDF();
        break;
      case "csv":
        downloadCSV();
        break;
      default:
        break;
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "data.json");
  };

  const downloadTXT = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "text/plain",
    });
    saveAs(blob, "data.txt");
  };

  const downloadDOC = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/msword",
    });
    saveAs(blob, "data.doc");
  };

  const downloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "data.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(jsonData, null, 2), 10, 10);
    doc.save("data.pdf");
  };

  const downloadCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "data.csv");
  };

  return (
    <>
      <h3 style={{ display: "inline", paddingRight: "10px" }}> Download as</h3>
      <Select
        defaultValue="json"
        onChange={handleFormatChange}
        style={{ width: 120, margin: "0 5px 0 0" }}
      >
        <Option value="json">JSON</Option>
        <Option value="txt">TXT</Option>
        <Option value="doc">DOC</Option>
        <Option value="xlsx">XLSX</Option>
        <Option value="pdf">PDF</Option>
        <Option value="csv">CSV</Option>
      </Select>
      <Button type="primary" onClick={handleDownload}>
        Download
      </Button>
    </>
  );
};

export default DataDownloader;
