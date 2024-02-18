import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Dashboard from "./Dashboard";


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
    <Container>
      <Row>
        <Col md={12}>
        <h3>{metricInput}</h3>
        </Col>
      </Row>
    </Container>
  );
}

export default VisualizeMetric;
