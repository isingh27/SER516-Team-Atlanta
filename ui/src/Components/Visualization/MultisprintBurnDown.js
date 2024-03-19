import React, {useState, useEffect} from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Chart } from "react-google-charts";
import taigaService from "../../Services/taiga-service";

function MultisprintBurnDown({ sprintOptions }) {
    const [burndownData, setBurnDownData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const convertDataForChart = (data) => {
        const sprintData = {};
    
        for (let i = 1; i < data.length; i++) {
            const [day, storyPoints, sprint] = data[i];
            if (!sprintData[sprint]) {
                sprintData[sprint] = [];
            }
            sprintData[sprint].push([day, storyPoints]);
        }
    
        const chartData = [["Day", "Optimal Points", ...Object.keys(sprintData)]];
        const maxDataPoints = Math.max(...Object.values(sprintData).map(sprint => sprint.length));
    
        let maxStoryPoints = 0;
        for (const sprint of Object.values(sprintData)) {
            for (const [day, storyPoints] of sprint) {
                maxStoryPoints = Math.max(maxStoryPoints, storyPoints);
            }
        }
        const daysLeft = maxDataPoints;
    
        for (let day = 1; day <= maxDataPoints; day++) {
            const row = [day]; // Initialize the row with the day
            const optimalPoints = maxStoryPoints - ((day-1) * (maxStoryPoints / daysLeft));
            row.push(optimalPoints); // Add the optimal points to the row
            for (const sprint of Object.keys(sprintData)) {
                const sprintPoints = sprintData[sprint][day - 1];
                if (sprintPoints) {
                    row.push(sprintPoints[1]); // Adding story points
                } else {
                    row.push(null); // Adding null for missing data points
                }
            }
            chartData.push(row);
        }
    
        return chartData;
    };
    
    useEffect(() => {
        const fetchData = async () => {
            const newData = [];
            setIsLoading(true);
    
            // Iterate over sprintOptions and fetch data for each sprint
            for (const sprint of sprintOptions) {
                try {
                    const response = await taigaService.taigaProjectBurnDownChart(localStorage.getItem('taigaToken'), sprint.name);
                    console.log(response.data);
    
                    if (response.data.status === 'success') {
                        console.log('Sprint', sprint.title, 'Burn Down Data:', response.data);
                        
                        const bdTempData = response.data.burndown_chart_data.days.map(data => {
                            const currentDate = new Date();
                            const dataDate = new Date(data.day);
                            
                            if (dataDate < currentDate) {
                                return [
                                    data.id,
                                    Math.floor(data.open_points),
                                    sprint.title
                                ];
                            }
                            
                            return null;
                        }).filter(data => data !== null);

                        // Append bdTempData to newData
                        newData.push(...bdTempData);
                    } else {
                        console.log('Burn Down Data Retrieval Failed');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            newData.unshift(['Day', 'Story Points', '# Sprint']);
            const seriesData = {};
            newData.slice(1).forEach(row => {
                const sprint = row[2];
                if (!seriesData[sprint]) {
                seriesData[sprint] = [];
                }
                seriesData[sprint].push([row[0], row[1]]);
            });

            // Convert seriesData to array of arrays
            const seriesArray = Object.entries(seriesData).map(([sprint, points]) => {
                return [sprint, ...points];
            });

            // Add header row
            // seriesArray.unshift(["Day", "Story Points"]);
            // Update state with the accumulated data
            const chartData = convertDataForChart(newData);
            setBurnDownData(chartData);
            console.info('Burn Down Data:', chartData);
            setIsLoading(false);
        };
    
        fetchData();
    }, []);


    const optionsBD = {
        chart: {
            title: "Multi Sprint Burndown",
            subtitle: "in days",
        },
        hAxis: { title: "Sprint # Day" },
        vAxis: { title: "Story points" },
        legend: { position: "right" },
    };
    //  const options = {
    //     title: "Multi Sprint Burndown",
    //     curveType: "function",
    //     legend: { position: "bottom" },
    //   };

  return (
    <Container>
      <Row>
        <b>Multi Sprint Burndown</b>
        {!isLoading ? <Col>
          {burndownData && (burndownData.length > 1) &&<Chart
            width={"100%"}
            height={"500px"}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={burndownData}
            options={optionsBD}
          />}
        </Col> : <Col><Spinner animation="border" role="status"></Spinner></Col>}
      </Row>
    </Container>
  );
}

export default MultisprintBurnDown;
