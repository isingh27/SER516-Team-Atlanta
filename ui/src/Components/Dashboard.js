import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";
// import BurndownChartVisualization from "./Visualization/BurndownChartVisualization"



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
  const [burndownData, setBurndownData] = useState([])
  const [sprintInput, setSprintInput] = useState("Sprint1");
  let projectId = localStorage.getItem("projectId");


  const handleChangeDropDown = (e) =>{
    console.log(e.target.value)
    setSprintInput(e.target.value)
    callBDData()
  }
  
  useEffect(() => {

    console.log("Selected option:", metricInput);
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
            return [`Task #${task.refId}`, task.cycle_time];
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
              return [`US #${task.refId}`, task.cycle_time];
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
            return [`Task #${data.refId}`, data.lead_time];
          });
          // leadTimeTempdata.sort((a, b) => a[0].localeCompare(b[0]));
          console.log(leadTimeTempdata);
          leadTimeTempdata.unshift(["Date", "Lead Time"]);
          setLeadTime(leadTimeTempdata);
          setLoadingLT(false)
        })

        

  }, []);

  useEffect(()=>{
    callBDData()
  },[sprintInput])
  const callBDData = () =>{
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
      const bdTempData = burndownRes.data.burndown_chart_data.days.map((data)=>{
        return [data.day,data.open_points, data.optimal_points]
      })
      bdTempData.sort((a, b) => a[0].localeCompare(b[0]));
      bdTempData.unshift(["Date", "Open Points", "Optimal Points"]);
      setBurndownData(bdTempData)
    })
    .catch((error) => {
      console.error(error.message);
    })
    .finally(() => {
      setLoadingBD(false);
    });

  }

  // const metricOptions = [
  //   {
  //     title: "Burndown Chart",
  //     name: "burndown",
  //   },
  //   {
  //     title: "Cumulative Flow Diagram",
  //     name: "cfd",
  //   },
  //   {
  //     title: "Cycle Time",
  //     name: "cycleTime",
  //   },
  //   {
  //     title: "Lead Time",
  //     name: "leadTime",
  //   },
  //   {
  //     title: "Throughput",
  //     name: "throughput",
  //   },
  //   {
  //     title: "Work in Progress",
  //     name: "wip",
  //   },
  //   {
  //     title: "Impediment Tracker",
  //     name: "impediment",
  //   },
  // ];


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
        <Col md={12} className="mb-4" style={{borderBottom:"1px solid black"}}>
          {!loadingBD ? <VisualizeMetric metricInput="burndown" sprintInput={sprintInput} setSprintInput={setSprintInput} metricData={burndownData} handleChangeDropDown={handleChangeDropDown}/>: <Loader />}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
