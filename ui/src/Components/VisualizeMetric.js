import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {Chart} from "react-google-charts";

import MetricInput from "./MetricInput";

function VisualizeMetric({ metricInput, metricData, avgMetricData }) {
  //TODO: Implement State Management for getting the metricInput
  const options = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
    },
    hAxis: { title: "# User Story" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "bottom" },
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          {metricInput === "cycleTime" && (
            <>
            <Chart
              width="100%"
              height="300px"
              chartType="Scatter"
              loader={<div>Loading Chart</div>}
              data={metricData}
              options={options}
              />
            {/* <h3>{avgMetricData} Days</h3> */}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default VisualizeMetric;
