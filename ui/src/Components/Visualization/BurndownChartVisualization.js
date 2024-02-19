import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Chart } from "react-google-charts";

function BurndownChartVisualization({ metricData }) {
  const chartDataArray = [
    [
      "Day",
      "Open Points",
      { role: "tooltip", type: "string", p: { html: true } },
      "Optimal Points",
      { role: "tooltip", type: "string", p: { html: true } },
    ],
    // ...metricData.days.map((day) => [
    //   day.id,
    //   day.open_points,
    //   `<div>${day.day}<br/>Open Points: ${Math.round(day.open_points)}</div>`,
    //   day.optimal_points,
    //   `<div>${day.day}<br/>Optimal Points: ${Math.round(
    //     day.optimal_points
    //   )}</div>`,
    // ]),
  ];

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="LineChart"
            loader={<div>Loading Chart...</div>}
            data={chartDataArray}
            options={{
              title: "Burndown Chart",
              curveType: "function",
              legend: { position: "bottom" },
              hAxis: {
                title: "Day",
              },
              tooltip: { isHtml: true },
            }}
            rootProps={{ "data-testid": "1" }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default BurndownChartVisualization;
