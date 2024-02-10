import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Chart } from "react-google-charts";

const MetricInput = () => {
  // sample data
  const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
  ];

  const [metricInput, setMetricInput] = useState("cycleTime");
  const metricOptions = [
    {
      title: "Cycle Time",
      name: "cycleTime",
    },
  ];

  const handleSubmit = () => {
    // TODO: Handle form submission logic
    console.log("Selected option:", metricInput);
    let projectId = localStorage.getItem("projectId");
    if (metricInput == "cycleTime") {
      taigaService
        .taigaProjectCycleTime(localStorage.getItem("taigaToken"), projectId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="mb-5">Select Metric Parameter</h2>
          <Row className="mb-3 align-items-center">
            <Col sm={3} className="text-left">
              <Form.Label className="small">Metric Parameter</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Select
                value={metricInput}
                onChange={(e) => setMetricInput(e.target.value)}
              >
                <option value="" disabled hidden>
                  Select Metric Parameter
                </option>
                {metricOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.title}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Col>
      </Row>
      <div style={{ width: "100%", maxWidth: 800 }}>
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={data}
          options={{
            title: "Company Performance",
            hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
            vAxis: { minValue: 0 },
            // For the legend to display properly, we must specify series type.
            // In this case, we use 'line' since the chart type is LineChart.
            series: {
              0: { type: "line" },
              1: { type: "line" },
            },
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    </Container>
  );
};

export default MetricInput;
