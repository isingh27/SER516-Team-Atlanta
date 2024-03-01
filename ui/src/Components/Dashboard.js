import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { useNavigate } from "react-router-dom";
import VisualizeMetric from "./VisualizeMetric";

const Dashboard = () => {
  const navigation = useNavigate();
  const [avgCycleTime, setAvgCycleTime] = useState("");

  const [loadingCTTask, setLoadingCTTask] = useState(true);
  const [loadingCTUS, setLoadingCTUS] = useState(true);
  const [loadingLT, setLoadingLT] = useState(true);
  const [loadingBD, setLoadingBD] = useState(true);
  const [loadingWip, setLoadingWip] = useState(true);

  const projectName = localStorage.getItem("projectName");

  const { metricInput, setMetricInput } = useContext(GlobalContext);
  const [cycleTimeByUS, setCycleTimeByUS] = useState();
  const [cycleTimeByTask, setCycleTimeByTask] = useState();
  const [leadTime, setLeadTime] = useState();
  const [burndownData, setBurndownData] = useState([]);
  const [throughputDaily, setThroughputDaily] = useState([]);
  const [cfdData, setCfdData] = useState([]);
  const [wipData, setWipData] = useState([]);
  const [sprintInput, setSprintInput] = useState("");
  const [sprints, setSprints] = useState([]);
  let projectId = localStorage.getItem("projectId");

  const handleChangeDropDown = (e) => {
    console.log(e.target.value);
    setSprintInput(e.target.value);
    // callBDData();
  };
  // TODO: Implement the workInProgress state (Dummy Data for now)
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
        } else {
          throw new Error("No sprints found for this project");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    console.log("Selected option:", metricInput);
    // setLoading(true);
    taigaService
      .taigaProjectCycleTime(localStorage.getItem("taigaToken"), projectId)
      .then((res) => {
        console.log(res);
        setAvgCycleTime(res.data.avg_cycle_time);
      });

    taigaService
      .taigaProjectCycleTimesPerTask(
        localStorage.getItem("taigaToken"),
        projectId
      )
      .then((res) => {
        console.log(res);
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
  }, []);
  useEffect(() => {
    if (sprintInput === "") fetchSprints();
    callBDData();
    callWipData();
    callThroughputDaily();
  }, [sprintInput]);

  const callBDData = () => {
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
            (sprint) => sprint[1].toString() === sprintInput
          );
          if (!selectedSprint) {
            throw new Error(`Sprint "${sprintInput}" not found`);
          }
          let sprintId = selectedSprint[1];
          console.log(sprintId);
          return taigaService.taigaProjectBurnDownChart(
            localStorage.getItem("taigaToken"),
            sprintId
          );
        } else {
          throw new Error("No sprints found for this project");
        }
      })
      .then((burndownRes) => {
        console.log(burndownRes);
        const bdTempData = burndownRes.data.burndown_chart_data.days.map(
          (data) => {
            return [data.day, data.open_points, data.optimal_points];
          }
        );
        bdTempData.sort((a, b) => a[0].localeCompare(b[0]));
        bdTempData.unshift(["Date", "Open Points", "Optimal Points"]);
        setBurndownData(bdTempData);
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setLoadingBD(false);
      });
  };

  const callWipData = () => {
    taigaService
      .taigaProjectWorkInProgress(localStorage.getItem("taigaToken"), projectId)
      .then((res) => {
        let wipChartData = [];
        res.data &&
          res.data.data.map((item) => {
            wipChartData.push([
              item.sprint_name,
              item["In Progress"],
              item["Done"],
            ]);
          });
        wipChartData.unshift(["Sprint", "Work In Progress", "Completed"]);
        setWipData(wipChartData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingWip(false);
      });
  };

  const callThroughputDaily = () => {
    console.log("Sprint Input", sprintInput);
    taigaService
      .taigaProjectThroughputDaily(
        localStorage.getItem("taigaToken"),
        projectId,
        sprintInput
      )
      .then((res) => {
        console.log("throughput daily response", res.data.throughput_data);
        setThroughputDaily(res.data.throughput_data);
        let throughputChartData = [];
        res.data.throughput_data.map((item) => {
          throughputChartData.push([item.date, item.tasks_done]);
        });
        throughputChartData.unshift(["Date", "Tasks Completed"]);
        console.log("throughputChartData", throughputChartData);
        setThroughputDaily(throughputChartData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingWip(false);
      });
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
              avgMetricData={avgCycleTime}
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
          {!loadingCTUS ? (
            <VisualizeMetric
              metricInput={"cycleTimeUS"}
              avgMetricData={avgCycleTime}
              metricData={cycleTimeByUS}
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
          {!loadingLT ? (
            <VisualizeMetric metricInput={"leadTime"} metricData={leadTime} />
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
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-4"
            // style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card">
              <Card.Body>
                {!loadingBD ? (
                  <VisualizeMetric
                    metricInput="burndown BV"
                    sprintInput={sprintInput}
                    setSprintInput={setSprintInput}
                    metricData={burndownData}
                    handleChangeDropDown={handleChangeDropDown}
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
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-4 mt-4"
            // style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card">
              <Card.Body>
                {!loadingLT ? (
                  <VisualizeMetric
                    metricInput={"workInProgress"}
                    metricData={workInProgress}
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
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-2"
            // style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card">
              <Card.Body>
                {!loadingLT ? (
                  <VisualizeMetric
                    metricInput={"throughput"}
                    metricData={throughputDaily}
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
        <div className="card-wrapper">
          <Col
            md={12}
            className="mb-4"
            style={{ borderBottom: "1px solid black" }}
          >
            <Card className="custom-card">
              <Card.Body>
                {!loadingLT ? (
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
