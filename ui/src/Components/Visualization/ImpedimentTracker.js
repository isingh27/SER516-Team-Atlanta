import React from "react";
import { Container } from "react-bootstrap";
import { Chart } from "react-google-charts";
import "../Styles/ImpedimentTracker.css";
export default function ImpedimentTracker({ metricData }) {
  const optionsImpedimentTracker = {
    vAxis: { title: "Date" },
    hAxis: { title: "Impediments" },
    legend: { position: "top" },
  };

  return (
    <div>
      <b>Impediment Tracker</b>
      <Chart
        width="100%"
        height="100%"
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={metricData}
        options={optionsImpedimentTracker}
      />
    </div>
  );
}

const ChartLegend = () => {
  return (
    <div className="chart-legend">
      <div className="legend-item">
        <span
          className="legend-color-box"
          style={{ backgroundColor: "rgb(66, 133, 244)" }}
        ></span>
        Impediments This Day
      </div>
      <div className="legend-item">
        <span
          className="legend-color-box"
          style={{ backgroundColor: "rgb(219, 68, 55)" }}
        ></span>
        Total Project Impediments
      </div>
    </div>
  );
};
