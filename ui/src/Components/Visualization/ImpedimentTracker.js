import React from "react";
import { Container } from "react-bootstrap";
import { Chart } from "react-google-charts";

export default function ImpedimentTracker({ metricData }) {
  const dummyMetricData = [
    ["Date", "ImpedimetsOnDay", "TotalImpediments"],
    ["2021-01-01", 1, 1],
    ["2021-01-02", 1, 2],
    ["2021-01-03", 1, 3],
    ["2021-01-04", 1, 4],
    ["2021-01-05", 10, 14],
    ["2021-01-06", 1, 16],
  ];

  const optionsImpedimentTracker = {
    chart: {
      title: "Impediment Tracker",
      subtitle: "in days",
    },
  };

  return (
    <Container fluid>
      <div>
        <b>ImpedimentTracker</b>
        <Chart
          width="100%"
          height="300px"
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={metricData}
          options={optionsImpedimentTracker}
        />
      </div>
    </Container>
  );
}
