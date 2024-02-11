import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function VisualizeMetric({ metricInput }) {
  //TODO: Implement State Management for getting the metricInput

  return (
    <Container> 
      <Row>
        <Col md={12}>
          {visualizationType === 'line' && (
            // Placeholder - Integrate charting library compatible with React-Bootstrap
            <h3>Line Chart Visualization (Placeholder)</h3> 
          )}
          {visualizationType === 'bar' && (
            // Placeholder - Integrate charting library compatible with React-Bootstrap
            <h3>Bar Chart Visualization (Placeholder)</h3> 
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default VisualizeMetric;
