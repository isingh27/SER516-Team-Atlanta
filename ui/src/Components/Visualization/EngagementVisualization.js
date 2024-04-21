import React, { useState } from 'react';
import { Chart } from 'react-google-charts';

const data = {
  "closed_bugs": {
    "Akash Vijayasarathy": 1,
    "Darsh Patel": 0,
    "Ishtpreet Singh": 0,
    "Karthik Vaida": 0,
    "Nikola Pop Tomov": 0,
    "Prabhanshu Singh": 0,
    "Raajveer Khattar": 3,
    "Rahul Manoj": 3,
    "Siddesh Shetty": 0,
    "Vedang Sharma": 1,
  },
  "iocaine_tasks": {
    "Akash Vijayasarathy": 0,
    "Darsh Patel": 0,
    "Ishtpreet Singh": 0,
    "Karthik Vaida": 0,
    "Nikola Pop Tomov": 0,
    "Prabhanshu Singh": 0,
    "Raajveer Khattar": 0,
    "Rahul Manoj": 0,
    "Siddesh Shetty": 0,
    "Vedang Sharma": 0,
  },
  "wiki_changes": {
    "Akash Vijayasarathy": 0,
    "Darsh Patel": 0,
    "Ishtpreet Singh": 0,
    "Karthik Vaida": 0,
    "Nikola Pop Tomov": 0,
    "Prabhanshu Singh": 0,
    "Raajveer Khattar": 0,
    "Rahul Manoj": 0,
    "Siddesh Shetty": 0,
    "Vedang Sharma": 0,
  },
  "created_bugs": {
    "Akash Vijayasarathy": 0,
    "Darsh Patel": 0,
    "Ishtpreet Singh": 0,
    "Karthik Vaida": 0,
    "Nikola Pop Tomov": 0,
    "Prabhanshu Singh": 0,
    "Raajveer Khattar": 3,
    "Rahul Manoj": 5,
    "Siddesh Shetty": 0,
    "Vedang Sharma": 1,
  },
  "closed_tasks": {
    "Akash Vijayasarathy": 41,
    "Darsh Patel": 2,
    "Ishtpreet Singh": 5,
    "Karthik Vaida": 1,
    "Nikola Pop Tomov": 0,
    "Prabhanshu Singh": 1,
    "Raajveer Khattar": 44,
    "Rahul Manoj": 36,
    "Siddesh Shetty": 1,
    "Vedang Sharma": 9,
  },
};

const metrics = Object.keys(data); // Get all metric names

const [selectedMetric, setSelectedMetric] = useState(metrics[0]); // Set initial selected metric

const handleChange = (event) => {
  setSelectedMetric(event.target.value);
};

const renderChart = () => {
  const chartData = [];
  const metricData = data[selectedMetric];

  for (const name in metricData) {
    chartData.push([name, metricData[name]]);
  }

  return (
    <Chart
      chartType="BarChart"
      data={chartData}
      options={{
        title: selectedMetric,
        hAxis: {
          title: 'Employee',
        },
        vAxis: {
          title: 'Count',
        },
      }}
    />
  );
};

const App = () => {
  return (
    <div>
      <select value={selectedMetric} onChange={handleChange}>
        {metrics.map((metric) => (
          <option key={metric} value={metric}>
            {metric}
          </option>
        ))}
      </select>
      {renderChart()}
    </div>
  );
};

export default App;
