import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";




const Dashboard = () => {

  const navigation = useNavigate();
  const [cycleTime, setCycleTime] = useState("");
  const [cycleTimeUS, setCycleTimeUS] = useState("");

  const [loading, setLoading] = useState(false);
  const projectName = localStorage.getItem("projectName");

  const { metricInput, setMetricInput } = useContext(GlobalContext);
  const [sprintInput, setSprintInput] = useState("Sprint1");
  const [metricData, setMetricData] = useState();
  const [metricDataUS, setMetricDataUS] = useState();
  const [isLoading, setIsLoading] = useState({ graph1: false, graph2: false, graph3: false });

  // Simulate graph data loading
  useEffect(() => {
    // const timers = [
    //   setTimeout(() => setIsLoading(prev => ({ ...prev, graph1: false })), 1000), // Graph 1 loads after 1s
    //   setTimeout(() => setIsLoading(prev => ({ ...prev, graph2: false })), 2000), // Graph 2 loads after 2s
    //   setTimeout(() => setIsLoading(prev => ({ ...prev, graph3: false })), 3000), // Graph 3 loads after 3s
    // ];

    // return () => timers.forEach(timer => clearTimeout(timer)); // Cleanup timeouts
  }, []);


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

  const Loader = () => (<Spinner animation="border" role="status" />);
    
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
    })}

     else if (metricInput == "leadTime") {
      taigaService
        .taigaProjectLeadTime(localStorage.getItem("taigaToken"), projectId)
        .then((res) => {
          console.log(res.data.plotData);
          const leadTimeTempdata = res.data.plotData.map((data) => {
            return [data.finished_date.slice(5, 16), data.lead_time];
          });
          leadTimeTempdata.sort((a, b) => a[0].localeCompare(b[0]));
          console.log(leadTimeTempdata);
          leadTimeTempdata.unshift(["Date", "Lead Time"]);
          setMetricData(leadTimeTempdata);
          setLoading(false);
        }
      );
    }
    else if (metricInput == "burndown") {
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
    <Container fluid>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={6} className="mb-4">
          {isLoading.graph1 ? <Loader /> : <VisualizeMetric metricInput="cycleTime" />}
        </Col>
        <Col md={6} className="mb-4">
          {isLoading.graph2 ? <Loader /> : <VisualizeMetric metricInput="cycleTimeUS" />}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
      <Col md={6} className="mb-4">
          {isLoading.graph3 ? <Loader /> : <VisualizeMetric metricInput="leadTime" />}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={6} className="mb-4">
          {isLoading.graph4 ? <Loader /> : <VisualizeMetric metricInput="burndown" />}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
