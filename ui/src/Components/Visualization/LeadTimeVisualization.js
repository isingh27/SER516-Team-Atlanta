import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import taigaService from "../../Services/taiga-service";

function LeadTimeVisualization({ metricData, loading, setLoading }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [leadTimeData, setLeadTimeData] = useState([]);
  const [customData, setCustomData] = useState(false);

  const handleOnSubmit = () => {
    // setLoading(true);
    taigaService
      .taigaUserProjectsLeadTimeByRange(
        localStorage.getItem("taigaToken"),
        localStorage.getItem("projectId"),
        startDate,
        endDate
      )
      .then((res) => {
        console.log("res", res.data);
        const leadTimeTempdata = res.data.plotData.map((data) => {
          return [`T-${data.refId}`, data.lead_time];
        });
        leadTimeTempdata.unshift(["Date", "Lead Time"]);
        console.log("LTrange", leadTimeData);
        setLeadTimeData(leadTimeTempdata);

        // setLoading(false);
        setCustomData(true);
      })
      .catch((err) => {
        console.log("err", err);
        // setLoading(false);
      });
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
  return (
    <Container fluid>
      <div>
        <b>Lead Time</b>
        <div className="date-picker">
          <div>
            <span>From:</span>
            <DatePicker
              className="date-picker-container"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          <div>
            <span>To: </span>
            <DatePicker
              className="date-picker-container"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </div>
        <Button variant="primary" onClick={handleOnSubmit}>
          Submit
        </Button>
        <Chart
          width="100%"
          height="300px"
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={customData ? leadTimeData : metricData}
          options={optionsLead}
        />
      </div>
    </Container>
  );
}

export default LeadTimeVisualization;
