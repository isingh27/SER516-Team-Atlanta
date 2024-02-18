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
  const [metricData, setMetricData] = useState();
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
    </Container>
  );
};

export default Dashboard;
