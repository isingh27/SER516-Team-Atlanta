import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {Chart} from "react-google-charts";

function VisualizeMetric({ metricInput, metricData, avgMetricData }) {
  //TODO: Implement State Management for getting the metricInput
  const options = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
      color:"red"
    },
    hAxis: { title: "# Task" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "right" },
  };
  const optionsUS = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
    },
    hAxis: { title: "# User Story" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "right" },
  };

  const optionsLead = {
    chart: {
      title: "Lead Time",
      subtitle: "in days",
    },
    hAxis: { title: "# Task" },
    vAxis: { title: "Lead Time" },
    legend: { position: "right" },
  };

  return (
    <Container fluid>
          {metricInput === "cycleTime" && (
            <>
            <b>Cycle Time by task</b>
            <Chart
              width="100%"
              height="300px"
              chartType="ScatterChart"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={options}
              />
            {/* <h3>{avgMetricData} Days</h3> */}
            </>
          )}
          {metricInput === "cycleTimeUS" && (
            <>
            <b>Cycle Time by user story</b>
            <Chart
              width="100%"
              height="300px"
              chartType="ScatterChart"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={optionsUS}
              />
            {/* <h3>{avgMetricData} Days</h3> */}
            </>
          )}
          {metricInput === "leadTime" && (
            <>
            <b>Lead Time</b>
            <Chart
              width="100%"
              height="300px"
              chartType="ScatterChart"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={optionsLead}
              />
            {/* <h3>{avgMetricData} Days</h3> */}
            </>
          )}
    </Container>
  );
}

export default VisualizeMetric;