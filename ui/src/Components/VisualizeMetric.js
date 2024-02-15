import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Chart } from "react-google-charts";

function VisualizeMetric({ metricInput, metricData }) {
  //TODO: Implement State Management for getting the metricInput
  const options = {
    chart: {
      title: "Lead Time",
      subtitle: "in days",
    },
    hAxis: { title: "Date" },
    vAxis: { title: "Lead Time" },
    legend: { position: "bottom" },
  };
  return (
    <Container>
      <Row>
        <Col md={12}>
          {metricInput === "cycleTime" && (
            // Placeholder - Integrate charting library compatible with React-Bootstrap
            <h3>{metricData}</h3>
          )}
        </Col>
        {metricInput === "leadTime" && (
          <Col md={12}>
            <Chart
              chartType="Scatter"
              width="100%"
              height="300px"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={options}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default VisualizeMetric;
