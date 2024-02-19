import React from "react";
import { Container, Row, Col, Form} from "react-bootstrap";
import {Chart} from "react-google-charts";

function VisualizeMetric({ metricInput, metricData, sprintInput,handleChangeDropDown }) {
  //TODO: Implement State Management for getting the metricInput
  const options = {
    chart: {
      title: "Cycle Time",
      subtitle: "in days",
      color:"red"
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
            {console.log("lead time",metricData)}
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
          {metricInput === "burndown" && (
            <>
              <b>Burndown Chart</b>
                  <Form.Select
                    value={sprintInput}
                    onChange={handleChangeDropDown}
                    required
                    style={{width:"10%"}}
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
                  {console.log("metricData bd",metricData)}
                  <Chart
                    width="100%"
                    height="300px"
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={metricData}
                    options={optionsBD}
                  />
                  </>
            )}
    </Container>
  );
}

export default VisualizeMetric;