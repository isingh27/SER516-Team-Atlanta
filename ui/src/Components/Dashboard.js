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


  return (
    <Container fluid>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
        {!loadingCTTask ? <VisualizeMetric metricInput={"cycleTime"} avgMetricData={avgCycleTime} metricData={cycleTimeByTask} />: <>Loading...</>}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
        {!loadingCTUS ? <VisualizeMetric metricInput={"cycleTimeUS"} avgMetricData={avgCycleTime} metricData={cycleTimeByUS} />: <>Loading...</>}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
          <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
          {!loadingLT ? <VisualizeMetric metricInput={"leadTime"}  metricData={leadTime} />: <>Loading...</>}
          </Col>
      </Row>
      <Row className="justify-content-md-center" style={{height:"400px"}}>
        <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
          {/* <BurndownChartVisualization /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
