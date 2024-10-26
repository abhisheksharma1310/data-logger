import React, { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Json2Chart = ({ jsonData }) => {
  const [chartData, setChartData] = useState(jsonData);
  const [config, setConfig] = useState({});
  const chartRef = useRef(null);

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setChartData({
      ...chartData,
      [name]: value,
    });
  };

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setConfig({
      ...config,
      [name]: value,
    });
  };

  const downloadChart = () => {
    html2canvas(chartRef.current).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "chart.png");
      });
    });
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: config.label || "Dataset",
        data: chartData.data,
        backgroundColor: config.backgroundColor || "rgba(75,192,192,0.4)",
        borderColor: config.borderColor || "rgba(75,192,192,1)",
        borderWidth: config.borderWidth || 1,
      },
    ],
  };

  return (
    <div>
      <h2>Customizable Chart</h2>
      <div>
        <h3>Customize Data:</h3>
        {Object.keys(jsonData).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <input
              name={key}
              value={chartData[key]}
              onChange={handleDataChange}
            />
          </div>
        ))}
      </div>
      <div>
        <h3>Customize Chart Configuration:</h3>
        <label>Label</label>
        <input
          name="label"
          value={config.label}
          onChange={handleConfigChange}
        />
        <label>Background Color</label>
        <input
          name="backgroundColor"
          value={config.backgroundColor}
          onChange={handleConfigChange}
        />
        <label>Border Color</label>
        <input
          name="borderColor"
          value={config.borderColor}
          onChange={handleConfigChange}
        />
        <label>Border Width</label>
        <input
          name="borderWidth"
          value={config.borderWidth}
          type="number"
          onChange={handleConfigChange}
        />
      </div>
      <div ref={chartRef}>
        <Line data={data} />
      </div>
      <button onClick={downloadChart}>Download Chart as Image</button>
    </div>
  );
};

export default Json2Chart;
