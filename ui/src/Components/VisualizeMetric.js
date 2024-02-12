import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MetricInput from "./MetricInput";

function VisualizeMetric({ metricInput, metricData }) {
  //TODO: Implement State Management for getting the metricInput

  return (
    <Container>
      <Row>
        <Col md={12}>
          {metricInput === "cycleTime" && (
            // Placeholder - Integrate charting library compatible with React-Bootstrap
            <h3>{metricData}</h3>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default VisualizeMetric;
