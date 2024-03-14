import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function LeadTimeVisualization({ metricData }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
        <Button variant="primary">Submit</Button>
        <Chart
          width="100%"
          height="300px"
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={metricData}
          options={optionsLead}
        />
      </div>
    </Container>
  );
}

export default LeadTimeVisualization;
