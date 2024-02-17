import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Dashboard from "./Dashboard";

function VisualizeMetric({ metricInput, metricData }) {
  //TODO: Implement State Management for getting the metricInput

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
