import { useEffect, useState } from "react";

import "../Styles/SBPBCoupling.css";

import { Chart } from "react-google-charts";

import { Container, Row, Col, Spinner } from "react-bootstrap";

export default function LineChartMaker(props) {
  console.log("props", props);

  const [data, setData] = useState(null);

  const options = {
    chart: {
      title: "Cost of Delay",
      subtitle: "in days",
    },
    hAxis: { title: "Sprint # Day" },
    vAxis: { title: props && props.type ? props.type : "" },
    legend: { position: "right" },
  };

  useEffect(() => {
    if (props.data) {
      console.log("props.data in LineChartMaker", props.data);
      const formattedData = Object.entries(props.data).map(([date, points]) => {
        const day = parseInt(date.split("-")[2]);
        return [day, points];
      });

      formattedData.unshift(["day", props.type]);

      console.log("cost of delay formatted data - ", formattedData);
      setData(formattedData);
      console.log("cost of delay data - ", data);
    }
  }, [props.data]);

  return (
    <div className="graph-container">
      <div style={{ margin: "auto" }}>
        {!props.showLoader ? (
          <Col>
            {data && data.length > 1 && (
              <Chart
                width={"700px"}
                height={"500px"}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={options}
              />
            )}
          </Col>
        ) : (
          <Col>
            <Spinner animation="border" role="status" />
          </Col>
        )}
      </div>
    </div>
  );
}
