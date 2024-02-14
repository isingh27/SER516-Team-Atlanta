import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import taigaService from "../Services/taiga-service";
import { Chart } from "react-google-charts";
import { useNavigate } from 'react-router-dom';

const MetricInput = () => {
  // sample data
  const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
  ];
  const navigation = useNavigate();
  const [metricInput, setMetricInput] = useState('cycleTime');
  const [cycleTime, setCycleTime] = useState('');
  const [loading, setLoading] = useState(false);
  const projectName = localStorage.getItem('projectName')

  const metricOptions = [
    {
      title: "Cycle Time",
      name: "cycleTime",
    },
  ];

  useEffect(() => {
    const taigaToken = localStorage.getItem('taigaToken');
    if (!taigaToken) {
        navigation('/');
    }
  }
  , [navigation]);

  const handleSubmit = () => {
    console.log('Selected option:', metricInput);
    setLoading(true);
    setCycleTime('');
    let projectId= localStorage.getItem('projectId')
    if(metricInput=="cycleTime"){
        taigaService.taigaProjectCycleTime(localStorage.getItem('taigaToken'),projectId)
        .then((res)=>{
            console.log(res)
            localStorage.setItem('cycleTime',JSON.stringify(res.data.avg_cycle_time))
            setCycleTime(res.data.avg_cycle_time)
            setLoading(false);
        })
        .catch((err)=>{
            console.log(err)
            setLoading(false);
        })
        taigaService.taigaProjectCycleTimesPerTask(localStorage.getItem('taigaToken'),projectId)
        .then((res)=>{
            console.log(res)
        })
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="mb-5">Select Metric Parameter</h2>
          {projectName && <h2 className="mb-5">Project: {projectName}</h2>}
          <Row className="mb-3 align-items-center">
            <Col sm={3} className="text-left">
              <Form.Label className="small">Metric Parameter</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Select
                value={metricInput}
                onChange={(e) => setMetricInput(e.target.value)}
              >
                <option value="" disabled hidden>
                  Select Metric Parameter
                </option>
                {metricOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.title}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Button variant="primary" type="submit" onClick={handleSubmit}>
              {loading && <Spinner animation="border" role="status" />} Submit
          </Button>
        </Col>
      </Row>
      <div style={{ width: "100%", maxWidth: 800 }}>
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={data}
          options={{
            title: "Company Performance",
            hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
            vAxis: { minValue: 0 },
            // For the legend to display properly, we must specify series type.
            // In this case, we use 'line' since the chart type is LineChart.
            series: {
              0: { type: "line" },
              1: { type: "line" },
            },
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
      {cycleTime && <Row>
          <Col md={{ span: 6, offset: 3 }}>
              <h2 className="mt-5">Cycle Time: {cycleTime}</h2>
          </Col>
      </Row>}
    </Container>
  );
};

export default MetricInput;