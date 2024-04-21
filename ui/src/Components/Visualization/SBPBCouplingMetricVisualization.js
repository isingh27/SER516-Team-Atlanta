import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "../Styles/SBPBCoupling.css";
import NetworkChartMaker from "./NetworkChartMaker";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Form,Spinner } from "react-bootstrap";

import taigaService from "../../Services/taiga-service";
import { prop } from "lodash/fp";

export default function SBPBCouplingMetricVisualization(props) {
  const [pbCouplingData, setPbCouplingData] = useState({
    nodes: [{ id: 0, label: "Waiting for data", title: "Title Not available" }],
    edges: [{ from: 0, to: 0 }],
  });
  const [sbCouplingData, setSbCouplingData] = useState({
    nodes: [{ id: 0, label: "Waiting for data", title: "Title Not available" }],
    edges: [{ from: 0, to: 0 }],
  });

  const [showLoader, setShowLoader] = useState(true);

  const [isSprintDisabled, setIsSprintDisabled] = useState(true);
  const [sprintData, setSprintData] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");

  const [sprintId, setSprintId] = useState(null);

  const [tab, setTab] = useState(0);

  const clearData = () => {
    setSprintData([]);
    setSprintId(null);
    setPbCouplingData(null);
    setSbCouplingData(null);
    setSelectedOption("");
    setIsSprintDisabled(true);
  };

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    setSprintId(e.target.value);
    setShowLoader(true);
  };

  function apiCall(url, updateCall, scenario, authToken) {
    taigaService.taigaSBCouplingData(url, authToken).then((res) => {
      console.log("res", res.data);
      if (res.data.nodes && res.data.edges) {
        updateCall(res.data);
      }
      setShowLoader(false);
    });
  }

  useEffect(() => {
    const callApis = () => {
      const authToken = localStorage.getItem("taigaToken");
      const projectId = localStorage.getItem("projectId");

      console.log("authToken", authToken);
      console.log("sprintId", sprintId);
      console.log("projectId", projectId);

      if (authToken && projectId) {
        apiCall(
          `sbpbcoupling/api/SbPbCoupling/pb_coupling?project_id=${projectId}`,
          setPbCouplingData,
          "Product Backlog information",
          authToken
        );
      }
      if (authToken && projectId && sprintId) {
        apiCall(
          `sbpbcoupling/api/SbPbCoupling/sb_coupling?sprint_id=${sprintId}`,
          setSbCouplingData,
          "Sprint Backlog information",
          authToken
        );
      }
    };

    callApis();
    const intervalId = setInterval(callApis, 30000);
    return () => clearInterval(intervalId);
  }, [sprintId, isSprintDisabled]);

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
        {showLoader ? (
          <Spinner animation="border" role="status" />        
          ) : (
          <Tabs
            style={{
              fontFamily: "Poppins",
              fontWeight: "500",
              fontSize: "0.9rem",
              border: "none",
              minHeight: "75%",
              display: "flex",
              flexDirection: "column",
            }}
            onSelect={(index) => {
              if (index == 1) {
                setIsSprintDisabled(false);
                setTab(1);
              }
              if (index == 0) {
                setIsSprintDisabled(true);
                setTab(0);
              }
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
              <span>SB/PB Coupling</span>
            </div>
            <TabList
              style={{
                display: "flex",
                justifyContent: "left",
                border: "none",
              }}
            >
              <Tab
                className={"tabElements"}
                selectedClassName="selectedTabElements"
              >
                <p
                  style={{
                    paddingLeft: "0.8rem",
                    paddingRight: "0.8rem",
                    paddingBottom: "0.8rem",
                    marginBottom: "0rem",
                    textAlign: "center",
                    borderRightStyle: "solid",
                    borderRightWidth: "2px",
                    borderRightColor: "#ef5350",
                  }}
                >
                  Product Backlog Coupling
                </p>
              </Tab>
              <Tab
                className={"tabElements"}
                selectedClassName="selectedTabElements"
              >
                <p
                  style={{
                    paddingLeft: "0.8rem",
                    paddingRight: "0.8rem",
                    paddingBottom: "0.8rem",
                    marginBottom: "0rem",
                    textAlign: "center",
                  }}
                >
                  Sprint Backlog Coupling
                </p>
              </Tab>
            </TabList>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "50%",
                marginTop: "1rem",
                // minHeight: "50%"
              }}
              className="parent"
            >
              {!isSprintDisabled &&
              props.sprintData &&
              props.sprintData.length > 0 ? (
                <Form.Select
                  value={selectedOption}
                  onChange={handleDropdownChange}
                  required
                  style={{ width: "20%", marginBottom: "1.5rem", fontSize: "1rem"}}
                >
                  <option value="" disabled hidden>
                    Select Sprint
                  </option>
                  {props.sprintData.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.title}
                    </option>
                  ))}
                </Form.Select>
              ) : null}
            </div>
            <TabPanel>
              <NetworkChartMaker
                data={pbCouplingData}
                setNodeType={"US"}
                showLoader={showLoader}
                setShowLoader={setShowLoader}
                scenario={"Enter Project Id to see the network chart"}
              />
            </TabPanel>
            <TabPanel>
              <NetworkChartMaker
                data={sbCouplingData}
                setNodeType={"US"}
                showLoader={showLoader}
                setShowLoader={setShowLoader}
                scenario={
                  "Enter Project Id and Sprint Id to see the network chart"
                }
              />
            </TabPanel>
          </Tabs>
        )}
      </div>
    </div>
  );
}

//end of code
