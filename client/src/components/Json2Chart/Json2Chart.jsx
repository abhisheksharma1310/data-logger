import React, { useState, useRef, useEffect } from "react";
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
  const [selectedDataItems, setSelectedDataItems] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [config, setConfig] = useState({});
  const [showSeparateCharts, setShowSeparateCharts] = useState(false);
  const chartRef = useRef(null);

  // Process the jsonData to extract labels and data
  useEffect(() => {
    if (!jsonData || !Array.isArray(jsonData)) {
      console.error("Invalid jsonData:", jsonData);
      return;
    }

    const labels = jsonData.map((item) => item.timestamp);

    const datasets = selectedDataItems.map((dataItem) => ({
      label: config[dataItem + "Label"] || dataItem,
      data: jsonData.map((item) => item[dataItem]),
      backgroundColor:
        config[dataItem + "BackgroundColor"] || `rgba(75,192,192,0.4)`,
      borderColor: config[dataItem + "BorderColor"] || `rgba(75,192,192,1)`,
      borderWidth: config[dataItem + "BorderWidth"] || 1,
    }));

    setChartData({
      labels,
      datasets,
    });
  }, [jsonData, config, selectedDataItems]);

  const downloadChart = () => {
    html2canvas(chartRef.current).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "chart.png");
      });
    });
  };

  const handleDataItemChange = (event) => {
    setSelectedDataItems(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setConfig({
      ...config,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Customizable Chart</h2>
      <div>
        <h3>Select Data Items to Display:</h3>
        <select multiple onChange={handleDataItemChange}>
          {Object.keys(jsonData[0] || {})
            .filter((key) => key !== "timestamp")
            .map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
        </select>
      </div>
      <div>
        <h3>Customize Chart Configuration:</h3>
        {selectedDataItems.map((dataItem) => (
          <div key={dataItem}>
            <h4>{dataItem}</h4>
            <label>Label</label>
            <input
              name={`${dataItem}Label`}
              value={config[`${dataItem}Label`] || ""}
              onChange={handleConfigChange}
            />
            <label>Background Color</label>
            <input
              name={`${dataItem}BackgroundColor`}
              value={config[`${dataItem}BackgroundColor`] || ""}
              onChange={handleConfigChange}
            />
            <label>Border Color</label>
            <input
              name={`${dataItem}BorderColor`}
              value={config[`${dataItem}BorderColor`] || ""}
              onChange={handleConfigChange}
            />
            <label>Border Width</label>
            <input
              name={`${dataItem}BorderWidth`}
              value={config[`${dataItem}BorderWidth`] || 1}
              type="number"
              onChange={handleConfigChange}
            />
          </div>
        ))}
      </div>
      <div>
        <label>Show Separate Charts</label>
        <input
          type="checkbox"
          checked={showSeparateCharts}
          onChange={(e) => setShowSeparateCharts(e.target.checked)}
        />
      </div>
      <div ref={chartRef}>
        {showSeparateCharts ? (
          selectedDataItems.map((dataItem) => (
            <div key={dataItem}>
              <h3>{config[dataItem + "Label"] || dataItem}</h3>
              <Line
                data={{
                  labels: chartData.labels,
                  datasets: [
                    chartData.datasets.find(
                      (d) =>
                        d.label === (config[dataItem + "Label"] || dataItem)
                    ),
                  ],
                }}
              />
            </div>
          ))
        ) : (
          <Line data={chartData} />
        )}
      </div>
      <button onClick={downloadChart}>Download Chart as Image</button>
    </div>
  );
};

export default Json2Chart;
