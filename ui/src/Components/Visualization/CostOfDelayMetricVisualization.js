import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "../Styles/SBPBCoupling.css";
import LineChartMaker from "./LineChartMaker";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import taigaService from "../../Services/taiga-service";

export default function CostOfDelayMetricVisualization(props) {
  const [storyPointData, setStoryPointData] = useState(null);
  const [businessValueData, setBusinessValueData] = useState(null);
  const [costOfDelayData, setCostOfDelayData] = useState(null);

  const [projectSlug, setProjectSlug] = useState(null);

  const [selectedOption, setSelectedOption] = useState("");

  const [projectId, setProjectId] = useState(null);
  const [sprintId, setSprintId] = useState(null);

  const [businessValueCostFactorInput, setBusinessValueCostFactorInput] =
    useState("");
  const [businessValueCostFactor, setBusinessValueCostFactor] = useState(null);

  const [showLoader, setShowLoader] = useState(false);

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value);
    setSprintId(e.target.value);
    setShowLoader(true);
  };

  function onChangeBusinessValueCostFactor(event) {
    setBusinessValueCostFactorInput(event.target.value);
    setCostOfDelayData(null);
    console.log("cost factor", businessValueCostFactor);
  }

  function createUpdatedData(data, updateCall, scenario) {
    console.log("data in createUpdatedData", data);
    updateCall(data);
  }

  // End -- of Auth

  function apiCall(url, authToken) {
    taigaService.taigaCostofDelayData(url, authToken).then((res) => {
      console.log("res", res.data);

      const data = res.data;

      // const labels = Object.keys(data["userstory"]);
      // const storyPointValues = Object.values(data["userstory"]);
      // const businessValues = Object.values(data["business_value"]);
      // const costOfDelayValues = Object.values(data["cost_of_delay"]);

      setShowLoader(false);

      createUpdatedData(
        data["userstory"],
        setStoryPointData,
        "storypoints graph"
      );
      createUpdatedData(
        data["business_value"],
        setBusinessValueData,
        "business value graph"
      );
      createUpdatedData(
        data["cost_of_delay"],
        setCostOfDelayData,
        "cost of delay graph"
      );
    });
  }

  useEffect(() => {
    const callApis = () => {
      const authToken = localStorage.getItem("taigaToken");
      const projectId = localStorage.getItem("projectId");

      if (authToken && projectId && sprintId && businessValueCostFactor) {
        apiCall(
          `costofdelay/api/cost_of_delay/get_cost_of_delay?project_id=${projectId}&sprint_id=${sprintId}&business_value_cost_factor=${businessValueCostFactor}`,
          authToken
        );
      }
    };

    callApis();
    const intervalId = setInterval(callApis, 30000);
    return () => clearInterval(intervalId);
  }, [sprintId, projectId, businessValueCostFactor]);

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
        >
          <div
            style={{
              fontSize: "2rem",
              width: "auto",
              fontWeight: "bold",
              backgroundColor: "white",
              transitionDuration: "300ms",
              fontFamily: "sans-serif",
              textAlign: "center",
              marginTop: "0",
              paddingBottom: "0.2rem",
              marginBottom: "1rem",
            }}
          >
            <span>Cost of Delay</span>
          </div>
          <TabList
            style={{
              display: "flex",
              justifyContent: "center",
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
                  paddingBottom: "0.2rem",
                  marginBottom: "0rem",
                  textAlign: "center",
                  borderRightStyle: "solid",
                  borderRightWidth: "2px",
                  borderRightColor: "#007bff",
                }}
              >
                Storypoints Affected
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
                  paddingBottom: "0.2rem",
                  marginBottom: "0rem",
                  textAlign: "center",
                  borderRight: "2px solid #007bff",
                }}
              >
                Business Value Affected
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
                Cost of Delay
              </p>
            </Tab>
          </TabList>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              marginTop: "1rem",
              // minHeight: "50%"
            }}
            className="parent"
          >
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "30%", marginRight: "0.5rem" }}>
                  {props.sprintData && props.sprintData.length > 0 ? (
                    <Form.Select
                      value={selectedOption}
                      onChange={handleDropdownChange}
                      required
                      style={{
                        marginBottom: "1.5rem",
                        fontSize: "0.8rem",
                      }}
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
                <div style={{ width: "30%", marginLeft: "0.5rem" }}>
                  <Form.Control
                    type="number"
                    placeholder="cost factor"
                    value={businessValueCostFactorInput}
                    onChange={onChangeBusinessValueCostFactor}
                    style={{
                      marginBottom: "1.5rem",
                      fontSize: "0.8rem",
                    }}
                  />
                </div>
              </div>
              <div>
                <button
                  style={{
                    marginLeft: "0.6rem",
                    height: "2.45rem",
                    width: "33%",
                    backgroundColor: "#007bff",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                  }}
                  onClick={() =>
                    setBusinessValueCostFactor(businessValueCostFactorInput)
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <TabPanel
            style={{
              margin: "auto",
              width: "100%",
            }}
          >
            <LineChartMaker
              data={storyPointData}
              type={"story points"}
              showLoader={showLoader}
            />
          </TabPanel>
          <TabPanel>
            <LineChartMaker
              data={businessValueData}
              type={"business value"}
              showLoader={showLoader}
            />
          </TabPanel>
          <TabPanel>
            <LineChartMaker
              data={costOfDelayData}
              type={"cost of delay"}
              showLoader={showLoader}
            />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
