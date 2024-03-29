import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";
import LeadTimeVisualization from "./Visualization/LeadTimeVisualization";
import CycleTimeArbRange from "./Visualization/CycleTimeArbRange";
import MultisprintBurnDown from "./Visualization/MultisprintBurnDown";

const Dashboard = () => {
  const navigation = useNavigate();

  const [loadingCTTask, setLoadingCTTask] = useState(true);
  const [loadingCTUS, setLoadingCTUS] = useState(true);
  const [loadingLT, setLoadingLT] = useState(true);
  const [loadingBD, setLoadingBD] = useState(true);
  // const [loadingBDBV, setLoadingBDBV] = useState(true);
  // const [loadingTotal, setLoadingTotal] = useState(true);
  const [loadingWip, setLoadingWip] = useState(true);
  const [loadingCFD, setLoadingCFD] = useState(true);
  const [loadingTP, setLoadingTP] = useState(true);
  const projectName = localStorage.getItem("projectName");

  const { metricInput, setMetricInput } = useContext(GlobalContext);
  const [cycleTimeByUS, setCycleTimeByUS] = useState();
  const [cycleTimeByTask, setCycleTimeByTask] = useState();
  const [leadTime, setLeadTime] = useState();
  const [burndownData, setBurndownData] = useState([]);
  const [totalBurndownData, setTotalBurndownData] = useState([]);
  const [throughputDaily, setThroughputDaily] = useState([]);
  const [wipData, setWipData] = useState([]);
  const [cfdData, setCfdData] = useState([]);
  const [burndownBVData, setBurndownBVData] = useState([]);
  const [burndownTotalData, setBurndownTotalData] = useState([])
  const [sprintInput, setSprintInput] = useState("");
  const [sprintInputBurnDown, setSprintInputBurnDown] = useState("");
  const [cfdSprintInput, setCfdSprintInput] = useState("");
  const [sprints, setSprints] = useState([]);
  const [sprintInputTP, setSprintInputTP] = useState("");
  let projectId = localStorage.getItem("projectId");
  const [cycleTimeData, setCycleTimeData] = useState([]);
  const [errorIncycleTimeUS, setErrorIncycleTimeUS] = useState(false);

  const handleChangeDropDown = (e) => {
    console.log(e.target.value);
    setSprintInput(e.target.value);
    // callBDData();
  };

  const handleChangeDropDownBurnDown = (e) => {
    console.log("changed", e.target.value);
    setSprintInputBurnDown(e.target.value);
    setSprintInput(e.target.value);
    // combineBDData();
    // callBDData();
  };

  const handleChangeDropDownTP = (e) => {
    setSprintInputTP(e.target.value);
  };

  const workInProgress = [
    ["Sprint", "Work In Progress", "Completed"],
    ["Sprint 1", 20, 80.22],
    ["Sprint 2", 40, 60],
    ["Sprint 3", 60, 40],
    ["Sprint 4", 80, 20],
    ["Sprint 5", 100, 0],
  ];

  const fetchSprints = () => {
    taigaService
      .taigaProjectSprints(localStorage.getItem("taigaToken"), projectId)
      .then((sprintsRes) => {
        if (
          sprintsRes &&
          sprintsRes.data &&
          sprintsRes.data.sprint_ids &&
          sprintsRes.data.sprint_ids.length > 0
        ) {
          const sprintOptions = sprintsRes.data.sprint_ids.map((sprint) => ({
            title: sprint[0],
            name: sprint[1].toString(),
          }));
          setSprints(sprintOptions);

          // Set initial sprintInput to the first sprint or to "Sprint1" explicitly
          const initialSprint =
            sprintOptions.find((option) => option.title === "Sprint1") ||
            sprintOptions[0];
          setSprintInput(initialSprint.name);
          setCfdSprintInput(initialSprint.name);
          setSprintInputTP(initialSprint.name);
          setSprintInputBurnDown(initialSprint.name);
        } else {
          throw new Error("No sprints found for this project");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const combineBDData = () => {
    console.log('we start fun enter')
    let tempCombinedBD = [];
    burndownData.forEach((item) => {
      if (item && item[0] !== "Date") {
        let newItem = [...item];
        newItem[3] = newItem[1]; // Set business value as partial points for init
        newItem[4] = newItem[2];
        tempCombinedBD.push(newItem);
      }
    });

    // Update with burndownTotalData
    burndownTotalData.forEach((item, index) => {
      if (item && item[0] !== "Date" && tempCombinedBD[index]) {
        tempCombinedBD[index][2] = item[1]; // Update total points
      }
    });

    // Update with burndownBVData
    burndownBVData.forEach((item, index) => {
      if (item && item[0] !== "Date" && tempCombinedBD[index]) {
        tempCombinedBD[index][3] = item[1]; // Update business value
      }
    });

  tempCombinedBD.unshift([
      "Date",
      "Partial Points",
      "Total Points",
      "Business Value",
      "Optimal Points",
    ]);
    console.log("tempCombinedBD ", tempCombinedBD);
    setTotalBurndownData(tempCombinedBD);
    setLoadingBD(false)
  };

  useEffect(() => {
    console.log("Selected option:", metricInput);
    // setLoading(true);
    // taigaService
    //   .taigaProjectCycleTime(localStorage.getItem("taigaToken"), projectId)
    //   .then((res) => {
    //     console.log(res);
    //     setAvgCycleTime(res.data.avg_cycle_time);
    //   });

    taigaService
      .taigaProjectCycleTimesPerTask(
        localStorage.getItem("taigaToken"),
        projectId
      )
      .then((res) => {
        console.log(res);
        setCycleTimeData(res.data.data);
        const cycleTimeData = res.data.data.map((task, index) => {
          return [`T-${task.refId}`, task.cycle_time];
        });
        console.log(cycleTimeData);
        cycleTimeData.unshift(["# Task", "Cycle Time"]);
        setCycleTimeByTask(cycleTimeData);
        setLoadingCTTask(false);
      });
    taigaService
      .taigaProjectCycleTimesPerUserStory(
        localStorage.getItem("taigaToken"),
        projectId
      )
      .then((res) => {
        console.log(res);
        const cycleTimeDataUS = res.data.data.map((task, index) => {
          return [`US #${task.refId}`, task.cycle_time];
        });
        console.log(cycleTimeDataUS);
        if (cycleTimeDataUS.length === 0) {

          // cycleTimeDataUS.push(["No data", 0]);
          setErrorIncycleTimeUS(true);
          setLoadingCTUS(false);
          return

        }
        cycleTimeDataUS.unshift(["# User Story", "Cycle Time"]);
        setCycleTimeByUS(cycleTimeDataUS);
        setLoadingCTUS(false);
      });

    taigaService
      .taigaProjectLeadTime(localStorage.getItem("taigaToken"), projectId)
      .then((res) => {
        console.log(res.data.plotData);
        const leadTimeTempdata = res.data.plotData.map((data) => {
          return [`T-${data.refId}`, data.lead_time];
        });
        // leadTimeTempdata.sort((a, b) => a[0].localeCompare(b[0]));
        console.log(leadTimeTempdata);
        leadTimeTempdata.unshift(["Date", "Lead Time"]);
        setLeadTime(leadTimeTempdata);
        setLoadingLT(false);
      });
    callWipData();
  }, []);
  useEffect(() => {
    if (sprintInput === "") {
      fetchSprints();
    }else{
      callBDData();
      callCFDData();
      callThroughputDaily();
      callBDBVData();
      callBDTotalData();
    }
    
  }, [sprintInput, cfdSprintInput, sprintInputTP]);

  useEffect(() => {
    setLoadingBD(true); // represents all BD-related loading states.
  
    const fetchDataAndUpdate = async () => {
      try {
        await Promise.all([
          callBDData(),
          callBDBVData(),
          callBDTotalData(),
        ]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoadingBD(false); // Now all fetching and state updates should be complete.
      }
    };
  
    fetchDataAndUpdate();
  }, [sprintInputBurnDown]);
    
  useEffect(() => {
    if (!loadingBD) {
      combineBDData();
    }
  }, [loadingBD, burndownData, burndownBVData, burndownTotalData]);

  
  const callThroughputDaily = () => {
    taigaService
      .taigaProjectThroughputDaily(
        localStorage.getItem("taigaToken"),
        projectId,
        sprintInputTP
      )
      .then((res) => {
        console.log("THROUGHPUT  DAILY: ", res.data.throughput_data);
        let throughputTempData = res.data.throughput_data.map((data) => {
          return [data.date, data.tasks_done];
        });
        throughputTempData.unshift(["Days", "Tasks Completed"]);
        setThroughputDaily(throughputTempData);
        setLoadingTP(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const callCFDData = () => {
    taigaService
      .taigaProjectSprints(localStorage.getItem("taigaToken"), projectId)
      .then((sprintsRes) => {
        console.log(sprintsRes);
        if (
          sprintsRes &&
          sprintsRes.data &&
          sprintsRes.data.sprint_ids &&
          sprintsRes.data.sprint_ids.length > 0
        ) {
          // Find the sprint ID that matches the selected sprint name
          const selectedSprint = sprintsRes.data.sprint_ids.find(
            (sprint) => sprint[1].toString() === cfdSprintInput
          );
          if (!selectedSprint) {
            throw new Error(`Sprint "${cfdSprintInput}" not found`);
          }
          let sprintId = selectedSprint[1];
          return taigaService.taigaProjectCumulativeFlowDiagram(
            localStorage.getItem("taigaToken"),
            projectId,
            sprintId
          );
        } else {
          throw new Error("No sprints found for this project");
        }
      })
      .then((cfdRes) => {
        console.log("cfdRes", cfdRes);
        const cfdTempData = cfdRes.data.data.map((data) => {
          return [data.date, data.closed, data.inProgress, data.new];
        });
        cfdTempData.unshift(["Date", "Closed", "In Progress", "New"]);
        console.log("cfdTempData", cfdTempData);
        setCfdData(cfdTempData);
        setLoadingCFD(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  const callBDData = async () => { //BD for partial storypoints
    try {
      const sprintsRes = await taigaService.taigaProjectSprints(localStorage.getItem("taigaToken"), projectId);
      console.log(sprintsRes);
      if (sprintsRes && sprintsRes.data && sprintsRes.data.sprint_ids && sprintsRes.data.sprint_ids.length > 0) {
        const selectedSprint = sprintsRes.data.sprint_ids.find(sprint => sprint[1].toString() === sprintInput);
        if (!selectedSprint) {
          throw new Error(`Sprint "${sprintInput}" not found`);
        }
        let sprintId = selectedSprint[1];
        console.log(sprintId);
  
        const burndownRes = await taigaService.taigaProjectBurnDownChart(localStorage.getItem("taigaToken"), sprintId);
        console.log(burndownRes);
  
        const bdTempData = burndownRes.data.burndown_chart_data.days.map(data => {
          return [data.day, data.open_points, data.optimal_points];
        });
        bdTempData.sort((a, b) => a[0].localeCompare(b[0]));
        bdTempData.unshift(["Date", "Open Points", "Optimal Points"]);
        setBurndownData(bdTempData);
      } else {
        throw new Error("No sprints found for this project");
      }
    } catch (error) {
      console.error(error.message);
    }
    };

    const callBDTotalData = async () => {
      try {
        const sprintsRes = await taigaService.taigaProjectSprints(localStorage.getItem("taigaToken"), projectId);
        console.log(sprintsRes);
    
        if (
          sprintsRes &&
          sprintsRes.data &&
          sprintsRes.data.sprint_ids &&
          sprintsRes.data.sprint_ids.length > 0
        ) {
          const selectedSprint = sprintsRes.data.sprint_ids.find(
            sprint => sprint[1].toString() === sprintInput
          );
          if (!selectedSprint) {
            throw new Error(`Sprint "${sprintInput}" not found`);
          }
          let sprintId = selectedSprint[1];
          console.log(sprintId);
    
          const burndownRes = await taigaService.taigaBurndownTotal(localStorage.getItem("taigaToken"), projectId, sprintId);
          console.log("total burndown", burndownRes.data.data);
    
          const bdTempData = burndownRes.data.data.total_burndown.total_burndown_data.map(data => {
            const dateObject = new Date(data.date);
            const formattedDate = dateObject.toISOString().split("T")[0];
            return [
              formattedDate,
              data.remaining,
              data.expected_remaining,
            ];
          });
          bdTempData.unshift(["Date", "Open Points", "Optimal Points"]);
          setBurndownTotalData(bdTempData);
        } else {
          throw new Error("No sprints found for this project");
        }
      } catch (error) {
        console.error(error.message);
      }
      
    };
      const callWipData = () => {
    setLoadingWip(true);
    taigaService
      .taigaProjectWorkInProgress(localStorage.getItem("taigaToken"), projectId)
      .then((res) => {
        let wipChartData = [];
        res.data &&
          Object.keys(res.data.data).map((item) => {
            wipChartData.push([
              item,
              res.data.data[item]["In Progress"],
              res.data.data[item]["Done"],
            ]);
          });
        wipChartData.unshift(["Sprint", "In Progress", "Done"]);
        setWipData(wipChartData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingWip(false);
      });
  };

  const callBDBVData = async () => {
    try {
      const sprintsRes = await taigaService.taigaProjectSprints(localStorage.getItem("taigaToken"), projectId);
      console.log(sprintsRes);
  
      if (
        sprintsRes &&
        sprintsRes.data &&
        sprintsRes.data.sprint_ids &&
        sprintsRes.data.sprint_ids.length > 0
      ) {
        const selectedSprint = sprintsRes.data.sprint_ids.find(
          sprint => sprint[1].toString() === sprintInput
        );
        if (!selectedSprint) {
          throw new Error(`Sprint "${sprintInput}" not found`);
        }
        let sprintId = selectedSprint[1];
        console.log(sprintId);
  
        const burndownRes = await taigaService.taigaBurnDownBV(localStorage.getItem("taigaToken"), projectId, sprintId);
        console.log("BVBurndown", burndownRes.data.data);
  
        const bdTempData = burndownRes.data.data.total_burndown.total_burndown_data.map(data => {
          const dateObject = new Date(data.date);
          const formattedDate = dateObject.toISOString().split("T")[0];
          return [
            formattedDate,
            data.remaining,
            data.expected_remaining,
          ];
        });
        bdTempData.unshift(["Date", "Open Points", "Optimal Points"]);
        setBurndownBVData(bdTempData);
      } else {
        throw new Error("No sprints found for this project");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const Loader = () => <Spinner animation="border" role="status" />;

  return (
    <Container fluid>
      <Row className="justify-content-md-center" style={{ height: "400px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingCTTask ? (
            <VisualizeMetric
              metricInput={"cycleTime"}
              metricData={cycleTimeByTask}
            />
          ) : (
            <Loader />
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{ height: "400px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingCTTask ? (
            <CycleTimeArbRange metricData={cycleTimeByTask} cycleTimeData={cycleTimeData}/>
          ) : (
            <Loader />
          )}
        </Col>
      </Row>
      <Row
        className="justify-content-md-center mt-3 mb-3"
        style={{ height: "400px" }}
      >
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-4"
            style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card">
              <Card.Body>
                {(!loadingCTUS && !errorIncycleTimeUS) ? (
                  <VisualizeMetric
                    metricInput={"cycleTimeUS"}
                          metricData={cycleTimeByUS}
                  />
                ) : loadingCTUS ? (
                  <Loader />
                ) : 
                (
                  <h3>No data available for Cycle Time by User Story</h3>
                )}
              </Card.Body>
            </Card>
          </Col>
        </div>
      </Row>
      <Row className="justify-content-md-center" style={{ height: "400px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingLT ? (
            <LeadTimeVisualization
              metricData={leadTime}
              loading={loadingLT}
              setLoading={setLoadingLT}
            />
          ) : (
            <Loader />
          )}
        </Col>
      </Row>
      {/*<Row className="justify-content-md-center" style={{ height: "400px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingBD ? (
            <VisualizeMetric
              metricInput="burndown"
              sprintInput={sprintInput}
              setSprintInput={setSprintInput}
              metricData={burndownData}
              handleChangeDropDown={handleChangeDropDown}
              sprintOptions={sprints}
            />
          ) : (
            <Loader />
          )}
        </Col>
      </Row> */}
      <Row className="justify-content-md-center mt-4">
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-4"
            style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card">
              <Card.Body>
                {!loadingBD && totalBurndownData.length > 1 ? (
                  <VisualizeMetric
                    metricInput="burndownBV"
                    sprintInputBurnDown={sprintInputBurnDown}
                    setSprintInputBurnDown={setSprintInputBurnDown}
                    metricData={totalBurndownData}
                    handleChangeDropDownBurnDown={handleChangeDropDownBurnDown}
                    sprintOptions={sprints}
                  />
                ) : (
                  <Loader />
                )}
              </Card.Body>
            </Card>
          </Col>
        </div>
      </Row>

      <Row className="justify-content-md-center" style={{ height: "400px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingWip ? (
            <VisualizeMetric
              metricInput={"workInProgress"}
              metricData={wipData}
            />
          ) : (
            <Loader />
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{ height: "400px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingTP ? (
            <VisualizeMetric
              metricInput={"throughputDaily"}
              sprintInput={sprintInputTP}
              setSprintInput={setSprintInputTP}
              metricData={throughputDaily}
              handleChangeDropDown={handleChangeDropDownTP}
              sprintOptions={sprints}
            />
          ) : (
            <Loader />
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center mt" style={{ height: "550px" }}>
        <Col
          md={12}
          className="mb-4"
          style={{ borderBottom: "1px solid black" }}
        >
          {!loadingBD ? 
          (sprints && (sprints.length > 0) && <MultisprintBurnDown sprintOptions={sprints} />) 
            : (
            <Loader />
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-4"
            style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card" style={{ height: "900px" }}>
              <Card.Body>
                {!loadingCFD ? (
                  <VisualizeMetric metricInput={"cfd"} metricData={cfdData} />
                ) : (
                  <Loader />
                )}
              </Card.Body>
            </Card>
          </Col>
        </div>
      </Row>
    </Container>
  );
};

export default Dashboard;
