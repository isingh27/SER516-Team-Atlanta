import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";

const MetricInput = () => {
  const navigation = useNavigate();
  const [cycleTime, setCycleTime] = useState("");
  const [cycleTimeUS, setCycleTimeUS] = useState("");

  const [loading, setLoading] = useState(false);
  const projectName = localStorage.getItem("projectName");

  const { metricInput, setMetricInput } = useContext(GlobalContext);
  const [metricData, setMetricData] = useState();
  const [metricDataUS, setMetricDataUS] = useState();

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
    },
  ];

  const handleSubmit = () => {
    console.log("Selected option:", metricInput);
    let projectId = localStorage.getItem("projectId");
    setLoading(true);
    if (metricInput == "cycleTime") {
      taigaService
        .taigaProjectCycleTime(localStorage.getItem("taigaToken"), projectId)
        .then((res) => {
          console.log(res);
          setCycleTime(res.data.avg_cycle_time);
          setLoading(false);
        });
      taigaService.taigaProjectCycleTimesPerTask(localStorage.getItem('taigaToken'),projectId)
        .then((res)=>{
          console.log(res)
          const cycleTimeData = res.data.data.map((task, index) => {
            return [`Task #${index}`, task.cycle_time];
          }
          );
          console.log(cycleTimeData);
          cycleTimeData.unshift(["# Task", "Cycle Time"]);
          setMetricData(cycleTimeData);

        });
      taigaService.taigaProjectCycleTimesPerUserStory(localStorage.getItem('taigaToken'),projectId)
        .then((res)=>{
          console.log(res)
          const cycleTimeDataUS = res.data.data.map((task, index) => {
            return [`US #${index}`, task.cycle_time];
          }
          );
          console.log(cycleTimeDataUS);
          cycleTimeDataUS.unshift(["# User Story", "Cycle Time"]);
          setMetricDataUS(cycleTimeDataUS);
        });
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
      </Row>
      <br />
      <br />
      {metricDataUS && <VisualizeMetric metricInput={`${metricInput}US`} avgMetricData={cycleTime} metricData={metricDataUS} />}
      {metricData && <VisualizeMetric metricInput={metricInput} avgMetricData={cycleTime} metricData={metricData} />}
      {cycleTime && (
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h2 className="mt-5">Cycle Time: {cycleTime}</h2>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MetricInput;
