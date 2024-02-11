import React, { useContext } from "react";
import { GlobalContext } from '../GlobalContext'; 
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Doughnut } from "react-chartjs-2";


const MetricInput = () => {

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
    </Container>
  );
};

export default MetricInput;
