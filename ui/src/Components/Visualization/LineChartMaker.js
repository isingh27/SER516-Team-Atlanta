import { useEffect, useState } from 'react';

import "../Styles/SBPBCoupling.css";

import { Chart } from "react-google-charts";

import { Container, Row, Col, Spinner} from 'react-bootstrap';

export default function LineChartMaker(props) {

    console.log("props", props);

    const options = {
        chart: {
            title: "Cost of Delay",
            subtitle: "in days",
        },
        hAxis: { title: "Sprint # Day" },
        vAxis: { title: "points of the type" },
        legend: { position: "right" },
    };

    return (
        <Container>
          <Row>
            {!props.showLoader ? (
              <Col>
                {props.data && props.data.length > 1 && (
                  <Chart
                    width={'100%'}
                    height={'500px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={props.data}
                    options={options}
                  />
                )}
              </Col>
            ) : (
              <Col><Spinner animation="border" role="status" /></Col>
            )}
          </Row>
        </Container>
    );
}