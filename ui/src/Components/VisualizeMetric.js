import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Chart } from "react-google-charts";

import MetricInput from "./MetricInput";


function VisualizeMetric({ metricInput, metricData, avgMetricData }) {
  //TODO: Implement State Management for getting the metricInput
  const optionsLeadTime = {
    chart: {
      title: "Lead Time",
      subtitle: "in days",
    },
    hAxis: { title: "Date" },
    vAxis: { title: "Lead Time" },
    legend: { position: "bottom" },
  };
  const options = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
    },
    hAxis: { title: "# User Story" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "bottom" },
  };
  const optionsUS = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
    },
    hAxis: { title: "# Task" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "bottom" },
  };

  return (
    <Container fluid>
          {metricInput === "cycleTime" && (
            <>
            <Chart
              width="100%"
              height="300px"
              className="mt-5"
              chartType="Scatter"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={options}
              />
            {/* <h3>{avgMetricData} Days</h3> */}
            </>
          )}
          {metricInput === "cycleTimeUS" && (
            <>
            <Chart
              width="100%"
              height="300px"
              chartType="Scatter"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={optionsUS}
              />
            {/* <h3>{avgMetricData} Days</h3> */}
            </>
          )}
          {metricInput === "leadTime" && (
            <>
            <Chart
              width="100%"
              height="300px"
              chartType="Scatter"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={optionsLeadTime}
              />
            </>
          )}

    </Container>
  );
}

export default VisualizeMetric;
