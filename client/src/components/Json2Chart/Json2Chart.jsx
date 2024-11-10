import React, { useState, useRef, useEffect } from "react";
import { Button, Checkbox, Input, Select } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const typeOptions = [
  { value: "line", label: "Line" },
  { value: "bar", label: "Bar" },
  { value: "pie", label: "Pie" },
];

const Json2Chart = ({ jsonData }) => {
  const [selectedDataItems, setSelectedDataItems] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [config, setConfig] = useState({});
  const [chartTypes, setChartTypes] = useState({});
  const [showSeparateCharts, setShowSeparateCharts] = useState(false);
  const chartRef = useRef(null);

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

  useEffect(() => {
    setChartData((prevData) => {
      const updatedDatasets = prevData.datasets.map((dataset, index) => ({
        ...dataset,
        type: chartTypes[selectedDataItems[index]] || "line",
      }));
      return { ...prevData, datasets: updatedDatasets };
    });
  }, [chartTypes, selectedDataItems]);

  const downloadChart = () => {
    html2canvas(chartRef.current).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "chart.png");
      });
    });
  };

  const handleDataItemChange = (event) => {
    const { name, checked } = event.target;
    setSelectedDataItems((prevItems) =>
      checked ? [...prevItems, name] : prevItems.filter((item) => item !== name)
    );
  };

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setConfig({
      ...config,
      [name]: value,
    });
  };

  const handleChartTypeChange = (value, dataItem) => {
    setChartTypes({
      ...chartTypes,
      [dataItem]: value,
    });
  };

  const getChartComponent = (type) => {
    switch (type) {
      case "bar":
        return Bar;
      case "pie":
        return Pie;
      case "line":
      default:
        return Line;
    }
  };

  return (
    <div>
      <div>
        <h3>Select Data Items to Display:</h3>
        <div className="input-div">
          {Object.keys(jsonData[0] || {})
            .filter((key) => key !== "timestamp")
            .map((key) => (
              <Checkbox
                key={key}
                type="checkbox"
                name={key}
                checked={selectedDataItems.includes(key)}
                onChange={handleDataItemChange}
              >
                {key}
              </Checkbox>
            ))}
        </div>
      </div>
      <div>
        <Checkbox
          type="checkbox"
          checked={showSeparateCharts}
          onChange={(e) => setShowSeparateCharts(e.target.checked)}
        >
          Show Separate Charts
        </Checkbox>
      </div>
      <div>
        <h3>Customize Chart Configuration:</h3>
        {selectedDataItems.map((dataItem) => (
          <div className="input-div" key={dataItem}>
            <h4>{dataItem}</h4>
            <Input
              addonBefore="Label"
              name={`${dataItem}Label`}
              value={config[`${dataItem}Label`] || ""}
              onChange={handleConfigChange}
              style={{ width: "200px" }}
            />
            <Input
              addonBefore="Background Color"
              name={`${dataItem}BackgroundColor`}
              value={config[`${dataItem}BackgroundColor`] || ""}
              onChange={handleConfigChange}
              style={{ width: "200px" }}
            />
            <Input
              addonBefore="Border Color"
              name={`${dataItem}BorderColor`}
              value={config[`${dataItem}BorderColor`] || ""}
              onChange={handleConfigChange}
              style={{ width: "200px" }}
            />
            <Input
              addonBefore="Border Width"
              name={`${dataItem}BorderWidth`}
              value={config[`${dataItem}BorderWidth`] || 1}
              type="number"
              onChange={handleConfigChange}
              style={{ width: "200px" }}
            />
            <label>Chart Type</label>
            <Select
              defaultValue={"line"}
              onChange={(value) => handleChartTypeChange(value, dataItem)}
              options={typeOptions}
            />
          </div>
        ))}
      </div>
      <div ref={chartRef}>
        {showSeparateCharts ? (
          selectedDataItems.map((dataItem) => {
            const ChartComponent = getChartComponent(chartTypes[dataItem]);
            const currentData = chartData.datasets.find(
              (d) => d.label === (config[dataItem + "Label"] || dataItem)
            );
            if (!currentData) return null;
            const displayData =
              ChartComponent === Pie
                ? currentData.data.slice(0, 5) // Limit the data points for Pie chart
                : currentData.data;
            const displayLabels =
              ChartComponent === Pie
                ? chartData.labels.slice(0, 5) // Limit the labels for Pie chart
                : chartData.labels;
            return (
              <div key={dataItem}>
                <h3>{config[dataItem + "Label"] || dataItem}</h3>
                <ChartComponent
                  data={{
                    labels: displayLabels,
                    datasets: [
                      {
                        ...currentData,
                        data: displayData,
                      },
                    ],
                  }}
                />
              </div>
            );
          })
        ) : (
          <Line data={chartData} />
        )}
      </div>
      <Button type="primary" onClick={downloadChart}>
        Download Chart as Image
      </Button>
    </div>
  );
};

export default Json2Chart;
