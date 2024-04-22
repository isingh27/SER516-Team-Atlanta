import React from 'react';
import { Chart } from 'react-google-charts';

function convertData(data) {
    const chartData = [['Metric', 'Count']];

    for (const metricKey in data)
        chartData.push([metricKey, data[metricKey]]);

    return chartData;
}

const BarChartMaker = ({ data, title }) => {

    const chartData = convertData(data);

    return (
        <Chart
            height={'500px'}
            chartType="BarChart"
            data={chartData}
            options={{
                title: title,
                hAxis: {
                    title: 'Contribution',
                },
                vAxis: {
                    title: 'Developer',
                },
            }}
        />
    );
};

export default BarChartMaker;
