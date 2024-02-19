import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";

const MetricInput = () => {
  const navigation = useNavigate();
  const [cycleTime, setCycleTime] = useState("");
  const [cycleTimeUS, setCycleTimeUS] = useState("");

  const [loading, setLoading] = useState(false);
  const projectName = localStorage.getItem("projectName");

  const { metricInput, setMetricInput } = useContext(GlobalContext);
  const [sprintInput, setSprintInput] = useState("");
  const [metricData, setMetricData] = useState();
  const [metricDataUS, setMetricDataUS] = useState();
  const [metricDataBurndown, setMetricDataBurndown] = useState();

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

  const sprintOptions = [
    {
      title: "Sprint 1",
      name: "Sprint1",
    },
    {
      title: "Sprint 2",
      name: "Sprint2",
    },
    {
      title: "Sprint 3",
      name: "Sprint3",
    },
    {
      title: "Sprint 4",
      name: "Sprint4",
    },
    {
      title: "Sprint 5",
      name: "Sprint5",
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
    } else if (metricInput == "burndown") {
      taigaService
        .taigaProjectSprints(localStorage.getItem("taigaToken"), projectId)
        .then((sprintsRes) => {
          console.log(sprintsRes);
          if (sprintsRes && sprintsRes.data && sprintsRes.data.sprint_ids && sprintsRes.data.sprint_ids.length > 0) {
            // Find the sprint ID that matches the selected sprint name
            const selectedSprint = sprintsRes.data.sprint_ids.find(sprint => sprint[0] === sprintInput);
            if (!selectedSprint) {
              throw new Error(`Sprint "${sprintInput}" not found`);
            }
            let sprintId = selectedSprint[1];
            console.log(sprintId);
            return taigaService.taigaProjectBurnDownChart(localStorage.getItem("taigaToken"), sprintId);
          } else {
            throw new Error("No sprints found for this project");
          }
        })
        .then((burndownRes) => {
          console.log(burndownRes);
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          setLoading(false);
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
          {metricInput === "burndown" && (
              <Row className="mb-3 align-items-center">
                <Col sm={3} className="text-left">
                  <Form.Label className="small">Select Sprint</Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Select
                    value={sprintInput}
                    onChange={(e) => setSprintInput(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      Select Sprint
                    </option>
                    {sprintOptions.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.title}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            )}
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            {loading && <Spinner animation="border" role="status" />} Submit
          </Button>
        </Col>
      </Row>
      <br />
      <br />
      {metricDataUS && <VisualizeMetric metricInput={`${metricInput}US`} avgMetricData={cycleTime} metricData={metricDataUS} />}
      {metricData && <VisualizeMetric metricInput={metricInput} avgMetricData={cycleTime} metricData={metricData} />}
      {/* TODO: Add visualization for burndown chart */}
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
