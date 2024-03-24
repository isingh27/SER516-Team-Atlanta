import { render, screen } from '@testing-library/react';
import VisualizeMetric from './VisualizeMetric';

describe('VisualizeMetric', () => {
  test('renders cycle time by task chart', () => {

    const metricInput = 'cycleTime';
    const metricData = []; 

    render(
      <VisualizeMetric
        metricInput={metricInput}
        metricData={metricData}
      />
    );
    const chartElement = screen.getByText(/Cycle Time by task/i);
    expect(chartElement).toBeInTheDocument();
  });

  test('renders cycle time by user story chart', () => {

    const metricInput = 'cycleTimeUS';
    const metricData = [];

    render(
      <VisualizeMetric
        metricInput={metricInput}
        metricData={metricData}
      />
    );
    const chartElement = screen.getByText(/Cycle Time by user story/i);
    expect(chartElement).toBeInTheDocument();
  });

    test('renders lead time chart', () => {

        const metricInput = 'leadTime';
        const metricData = []; 

        render(
        <VisualizeMetric
            metricInput={metricInput}
            metricData={metricData}
        />
        );
        const chartElement = screen.getByText(/Lead Time/i);
        expect(chartElement).toBeInTheDocument();
    });

    test('renders burndown chart', () => {

        const metricInput = 'burndownBV';
        const metricData = []; 
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
        
        render(
        <VisualizeMetric
            metricInput={metricInput}
            metricData={metricData}
            sprintOptions={sprintOptions}
        />
        );
        
        const chartElement = screen.getByText(/Burndown Charts/i);
        expect(chartElement).toBeInTheDocument();
    });

    test('renders wip chart', () => {

        const metricInput = 'workInProgress';
        const metricData = [];

        render(
        <VisualizeMetric
            metricInput={metricInput}
            metricData={metricData}
        />
        );
        const chartElement = screen.getByText(/WIP: Work In Progress/i);
        expect(chartElement).toBeInTheDocument();
    });
    test('renders throughput daily chart', () => {

        const metricInput = 'throughputDaily';
        const metricData = [];
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

        render(
        <VisualizeMetric
            metricInput={metricInput}
            metricData={metricData}
            sprintOptions={sprintOptions}
        />
        );
        const chartElement = screen.getByText(/Throughput Daily/i);
        expect(chartElement).toBeInTheDocument();
    });

    test('renders CFD Chart', () => {

        const metricInput = 'cfd';
        const metricData = [];

        render(
        <VisualizeMetric
            metricInput={metricInput}
            metricData={metricData}
        />
        );
        const chartElement = screen.getByText(/Cumulative Flow Diagram/i);
        expect(chartElement).toBeInTheDocument();
    });

});