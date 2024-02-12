import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from '../GlobalContext'; 
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Chart } from "react-google-charts";
import { useNavigate } from 'react-router-dom';

const MetricInput = () => {
  // sample data
  const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
  ];
  const navigation = useNavigate();
  const [cycleTime, setCycleTime] = useState('');
  const [loading, setLoading] = useState(false);
  const projectName = localStorage.getItem('projectName')

  const { metricInput, setMetricInput } = useContext(GlobalContext);

  const metricOptions = [
    {
      title: "Burndown Chart",
      name: "burndown",
    },
    {
      title: "Cumulative Flow Diagram",
      name: "cfd",
    },
    {
      title: "Cycle Time",
      name: "cycleTime",
    },
    {
      title: "Lead Time",
      name: "leadTime",
    },
    {
      title: "Throughput",
      name: "throughput",
    },
    {
      title: "Work in Progress",
      name: "wip",
    },
    {
      title: "Impediment Tracker",
      name: "impediment",
    }

  ];


  const handleSubmit = () => {
    console.log("Selected option:", metricInput);
    let projectId = localStorage.getItem("projectId");
    if (metricInput == "cycleTime") {
      taigaService
        .taigaProjectCycleTime(localStorage.getItem("taigaToken"), projectId)
        .then((res) => {
          console.log(res);
        })
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="mb-5">Select Metric Parameter</h2>
          {projectName && <h2 className="mb-5">Project: {projectName}</h2>}
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
              {loading && <Spinner animation="border" role="status" />} Submit
          </Button>
        </Col>
      </Row><br /><br />
      <div style={{ textAlign:"center",justifyContent:"center"}}>
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="LineChart"
          loader={<p>Loading Chart...</p>}
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
      {cycleTime && <Row>
          <Col md={{ span: 6, offset: 3 }}>
              <h2 className="mt-5">Cycle Time: {cycleTime}</h2>
          </Col>
      </Row>}
    </Container>
  );
};

export default MetricInput;