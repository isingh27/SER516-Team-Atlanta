import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";
import BurndownChartVisualization from "./Visualization/BurndownChartVisualization"



const Dashboard = () => {

  const navigation = useNavigate();
  const [avgCycleTime, setAvgCycleTime] = useState("");

  
  const [loadingCTTask, setLoadingCTTask] = useState(true);
  const [loadingCTUS, setLoadingCTUS] = useState(true);
  const [loadingLT, setLoadingLT] = useState(true);
  const [loadingBD, setLoadingBD] = useState(true);

  const projectName = localStorage.getItem("projectName");

  const { metricInput, setMetricInput } = useContext(GlobalContext);
  const [cycleTimeByUS, setCycleTimeByUS] = useState();
  const [cycleTimeByTask, setCycleTimeByTask] = useState();
  const [leadTime,setLeadTime] = useState();
  const [sprintInput, setSprintInput] = useState("Sprint1");

  useEffect(() => {

    console.log("Selected option:", metricInput);
    let projectId = localStorage.getItem("projectId");
    // setLoading(true);
        taigaService
        .taigaProjectCycleTime(localStorage.getItem("taigaToken"), projectId)
        .then((res) => {
          console.log(res);
          setAvgCycleTime(res.data.avg_cycle_time);
        });
        
        taigaService.taigaProjectCycleTimesPerTask(localStorage.getItem('taigaToken'),projectId)
        .then((res)=>{
          console.log(res)
          const cycleTimeData = res.data.data.map((task, index) => {
            return [`Task #${index+1}`, task.cycle_time];
          }
          );
          console.log(cycleTimeData);
          cycleTimeData.unshift(["# Task", "Cycle Time"]);
          setCycleTimeByTask(cycleTimeData);
          setLoadingCTTask(false)
        });
        taigaService.taigaProjectCycleTimesPerUserStory(localStorage.getItem('taigaToken'),projectId)
          .then((res)=>{
            console.log(res)
            const cycleTimeDataUS = res.data.data.map((task, index) => {
              return [`US #${index+1}`, task.cycle_time];
            }
            );
            console.log(cycleTimeDataUS);
            cycleTimeDataUS.unshift(["# User Story", "Cycle Time"]);
            setCycleTimeByUS(cycleTimeDataUS);
            setLoadingCTUS(false)
          })

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
          setLeadTime(leadTimeTempdata);
          setLoadingLT(false)
        })

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
          setLoadingBD(false);
        });

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
    

  return (
    <Container fluid>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
        {!loadingCTTask ? <VisualizeMetric metricInput={"cycleTime"} avgMetricData={avgCycleTime} metricData={cycleTimeByTask} />: <Loader />}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
        {!loadingCTUS ? <VisualizeMetric metricInput={"cycleTimeUS"} avgMetricData={avgCycleTime} metricData={cycleTimeByUS} />: <Loader />}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
          <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
          {!loadingLT ? <VisualizeMetric metricInput={"leadTime"}  metricData={leadTime} />: <Loader />}
          </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={6} className="mb-4">
          {!loadingBD ? <VisualizeMetric metricInput="burndown" />: <Loader />}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
