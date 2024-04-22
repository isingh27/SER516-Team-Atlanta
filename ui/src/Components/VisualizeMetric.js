import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Chart } from "react-google-charts";

function VisualizeMetric({
  metricInput,
  metricData,
  sprintInput,
  handleChangeDropDown,
  sprintOptions,
  sprintInputBurnDown,
  handleChangeDropDownBurnDown,
}) {
  const options = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
      color: "red",
    },
    hAxis: { title: "# Task" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "right" },
  };
  const optionsUS = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
    },
    hAxis: { title: "# User Story" },
    vAxis: { title: "Cycle Time" },
    legend: { position: "right" },
  };

  const optionsLead = {
    chart: {
      title: "Lead Time",
      subtitle: "in days",
    },
    hAxis: { title: "# Task" },
    vAxis: { title: "Lead Time" },
    legend: { position: "right" },
  };

  const optionsBD = {
    chart: {
      title: "Burndown",
      subtitle: "in days",
    },
    hAxis: { title: "Date" },
    vAxis: { title: "Story points" },
    legend: { position: "right" },
  };

  const optionsBDBV = {
    chart: {
      title: "Burndown",
      subtitle: "in days",
    },
    hAxis: { title: "Date" },
    vAxis: { title: "Business Value" },
    legend: { position: "right" },
    curveType: "function",
  };

  const optionsWIP = {
    chart: {
      title: "Work In Progress",
      subtitle: "in percentage",
    },
    hAxis: { title: "Work In Progress" },
    vAxis: { title: "Sprints" },
    legend: { position: "right" },
  };

  const optionsTP = {
    chart: {
      title: "Throughput",
      subtitle: "per days",
    },
    hAxis: { title: "Tasks Completed" },
    vAxis: { title: "Days" },
    legend: { position: "right" },
  };

  const optionsCFD = {
    title: "Cumulative Flow Diagram",
    height: "800",
    vAxis: { title: "Completed Stories" },
    hAxis: { title: "Time" }, //TODO: Can be time or sprints
    isStacked: true,
  };

  // const sprintOptions = [
  //   {
  //     title: "Sprint 1",
  //     name: "Sprint1",
  //   },
  //   {
  //     title: "Sprint 2",
  //     name: "Sprint2",
  //   },
  //   {
  //     title: "Sprint 3",
  //     name: "Sprint3",
  //   },
  //   {
  //     title: "Sprint 4",
  //     name: "Sprint4",
  //   },
  //   {
  //     title: "Sprint 5",
  //     name: "Sprint5",
  //   },
  // ];
  return (
    <Container fluid>
      {metricInput === "cycleTime" && (
        <>
          <b>Cycle Time by task</b>
          <Chart
            width="100%"
            height="300px"
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={options}
          />
          {/* <h3>{avgMetricData} Days</h3> */}
        </>
      )}
      {metricInput === "cycleTimeUS" && (
        <>
          <b>Cycle Time by user story</b>
          <Chart
            width="100%"
            height="300px"
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsUS}
          />
          {/* <h3>{avgMetricData} Days</h3> */}
        </>
      )}
      {metricInput === "leadTime" && (
        <>
          <b>Lead Time</b>
          {console.log("lead time", metricData)}
          <Chart
            width="100%"
            height="300px"
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsLead}
          />
          {/* <h3>{avgMetricData} Days</h3> */}
        </>
      )}
      {/* {metricInput === "burndown" && metricData.length>0 && (
        <>
          <b>Burndown Chart - Partial Story Points</b>
          <Form.Select
            value={sprintInput}
            onChange={handleChangeDropDown}
            required
            style={{ width: "10%" }}
          >
            <option value="" disabled hidden>
              Select Sprint
            </option>
            {sprintOptions.map((option, index) => (
              <option key={index} value={option.name}>
                {option.title}
              </option>
            ))}
          </Form.Select>
          <Chart
            width="100%"
            height="300px"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsBD}
          />
        </>
      )} */}
      {metricInput === "burndownBV" && (
        <>
          <b>Burndown Charts</b>
          <Form.Select
            value={sprintInputBurnDown}
            onChange={handleChangeDropDownBurnDown}
            required
            style={{ width: "22%", marginInline: "auto", marginTop: "1rem", marginBottom: "0.5rem"}}
          >
            <option value="" disabled hidden>
              Select Sprint
            </option>
            {sprintOptions.map((option, index) => (
              <option key={index} value={option.name}>
                {option.title}
              </option>
            ))}
          </Form.Select>
          <Chart
            width="100%"
            height="300px"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsBDBV}
          />
        </>
      )}
      {metricInput === "workInProgress" && (
        <>
          <b>WIP: Work In Progress</b>
          {console.log("Wip", metricData)}
          <Chart
            width="100%"
            height="300px"
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsWIP}
          />
          {/* <h3>{avgMetricData} Days</h3> */}
        </>
      )}
      {metricInput === "throughputDaily" && (
        <>
          <b>Throughput Daily</b>
          <Form.Select
            value={sprintInput}
            onChange={handleChangeDropDown}
            required
            style={{ width: "22%", marginInline: "auto", marginTop: "1rem", marginBottom: "0.5rem" }}
          >
            <option value="" disabled hidden>
              Select Sprint
            </option>
            {sprintOptions.map((option, index) => (
              <option key={index} value={option.name}>
                {option.title}
              </option>
            ))}
          </Form.Select>
          {console.log("TP", metricData)}
          <Chart
            width="100%"
            height="300px"
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsTP}
          />
          {/* <h3>{avgMetricData} Days</h3> */}
        </>
      )}
      {metricInput === "cfd" && (
        <>
          <b>Cumulative Flow Diagram</b>
          {console.log("CFD", metricData)}
          <Chart
            width="100%"
            height="800"
            chartType="AreaChart"
            loader={<div>Loading Chart</div>}
            data={metricData}
            options={optionsCFD}
            legendToggle
          />
          {/* <h3>{avgMetricData} Days</h3> */}
        </>
      )}
    </Container>
  );
}

export default VisualizeMetric;
