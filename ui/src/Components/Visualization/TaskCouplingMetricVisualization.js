// Imports
import React from "react";
import { useEffect, useState } from "react";
import "../Styles/SBPBCoupling.css";
import NetworkChartMaker from "./NetworkChartMaker.js";
import taigaService from "../../Services/taiga-service";
// Imports

// TaskCoupling function component
export default function TaskCoupling(props) {

// UseState Hooks
  const [taskCouplingData, setTaskCouplingData] = useState({
    nodes: [{ id: 0, label: "Waiting for data", title: "Title Not available" }],
    edges: [{ from: 0, to: 0 }],
  });
  const [showLoader, setShowLoader] = useState(true);
  const [isSprintDisabled, setIsSprintDisabled] = useState(true);
  const [sprintData, setSprintData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [sprintId, setSprintId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [tab, setTab] = useState(0);
// UseState Hooks

  const clearData = () => {
    setSprintData([]);
    setSprintId(null);
    setTaskCouplingData(null);
    setSelectedOption("");
    setIsSprintDisabled(true);
  };

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    setSprintId(e.target.value);
    setShowLoader(true);
  };

// Fetching data from the API
  function apiCall(url, updateCall, scenario, authToken) {
    taigaService.taigaTaskCouplingData(url, authToken).then((res) => {
      console.log("res", res.data);
      if (res.data && res.data.nodes && res.data.edges) {
        updateCall(res.data);
      }
      setShowLoader(false);
    });
  }
// Fetching data from the API


// Plugging the data to the NetworkChartMaker component
useEffect(() => {
  const callApis = () => {
    const authToken = localStorage.getItem("taigaToken");
    const projectId = localStorage.getItem("projectId");

    console.log("authToken", authToken);
    console.log("sprintId", sprintId);
    console.log("projectId", projectId);

    if (authToken && projectId) {
      apiCall(
        `taskcoupling/api/taskCoupling/task_coupling?project_id=${projectId}`,
        setTaskCouplingData,
        "Task Coupling data",
        authToken
      );
    }
  };

  callApis();
  const intervalId = setInterval(callApis, 30000);
  return () => clearInterval(intervalId);
}, [sprintId, isSprintDisabled]);
// Plugging the data to the NetworkChartMaker component

// Rendering the UI
  return (
    <div className="container-full bg-white">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "1rem",
          paddingRight: "2rem",
          paddingBottom: "1rem",
          paddingLeft: "2rem",
        }}
      >
          <div
            style={{
              fontFamily: "Poppins",
              fontWeight: "500",
              fontSize: "0.9rem",
              border: "none",
              minHeight: "75%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                width: "auto",
                borderBottomStyle: "solid",
                borderBottomWidth: "4px",
                borderBottomColor: "#ffd053",
                fontWeight: "bold",
                backgroundColor: "white",
                transitionDuration: "300ms",
                fontFamily: "sans-serif",
                textAlign: "start",
                marginTop: "0",
                paddingBottom: "0.2rem",
                marginBottom: "1rem",
              }}
            >
              <span>Task Coupling</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "1rem",
              }}
              className="parent"
            >
              <NetworkChartMaker
                data={taskCouplingData}
                setNodeType={"US"}
                showLoader={showLoader}
                setShowLoader={setShowLoader}
                scenario={"This project has no tasks"}
              />
          </div>
      </div>
    </div>
    </div>
  );
// Rendering the UI
}
// TaskCoupling function component