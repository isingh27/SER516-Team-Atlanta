import React, {useState} from 'react'
import { Button } from 'react-bootstrap';
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CycleTimeArbRange({ metricData, cycleTimeData }) {

        const [startDate, setStartDate] = useState(new Date());
        const [endDate, setEndDate] = useState(new Date());
        const [data, setData] = useState(metricData);

        const filterDataByDate = (d, startDate, endDate) => {
            return d.filter(item => {
              const itemStartDate = new Date(item.start_date);
              const itemEndDate = new Date(item.end_date);
              const filterStartDate = new Date(startDate);
              const filterEndDate = new Date(endDate);
              
              return itemStartDate >= filterStartDate && itemEndDate <= filterEndDate;
            });
          }
        const handleOnSubmit = () => {
            console.log(startDate);
            console.log(endDate);
            const filteredData = filterDataByDate(cycleTimeData, startDate, endDate);
            console.log(filteredData);
            if (filteredData.length === 0) {
              console.log("No data found");
              return;
            }
            const cycleTimeDataTemp = filteredData.map((task, index) => {
                return [`T-${task.refId}`, task.cycle_time];
              });
              console.log(cycleTimeDataTemp);
              cycleTimeDataTemp.unshift(["# Task", "Cycle Time"]);
            setData(cycleTimeDataTemp);            
        }
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
  return (
        <>
          <b>Cycle Time with Arbritary Range</b>
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
            <Button variant="primary" onClick={handleOnSubmit}>Submit</Button>
          <Chart
            width="100%"
            height="300px"
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={options}
          />
        </>
  )
}
