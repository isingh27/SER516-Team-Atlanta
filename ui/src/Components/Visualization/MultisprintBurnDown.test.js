import React from "react";
import { render, screen } from "@testing-library/react";
import MultisprintBurnDown from './MultisprintBurnDown';

// Mock the taigaService
jest.mock('../../Services/taiga-service', () => {
  return {
    taigaProjectBurnDownChart: jest.fn().mockResolvedValue({
      data: {
        status: "success",
        data: [
          ["Day", "Story Points", "Sprint"],
          [1, 10, "Sprint 1"],
          [2, 8, "Sprint 1"],
          [3, 6, "Sprint 1"],
        ],
      },
    }),
  };
});

describe('MultisprintBurnDown', () => {
  test('renders the component', () => {
    render(
      <MultisprintBurnDown
        sprintOptions={[]}
      />
    );

    expect(screen.getByText("Multi Sprint Burndown")).toBeInTheDocument();
  });


  test('handles missing data points', () => {
    const data = [
      ["Day", "Story Points", "Sprint"],
      [1, 10, "Sprint 1"],
      [2, 8, "Sprint 1"],
      [1, 12, "Sprint 2"],
      [3, 6, "Sprint 1"],
      [3, 5, "Sprint 2"],
    ];

    const expectedChartData = [
      ["Day", "Optimal Points", "Sprint 1", "Sprint 2"],
      [1, 12, 10, 12],
      [2, 9, 8, null],
      [3, 6, 6, 5],
    ];

    render(
      <MultisprintBurnDown
        sprintOptions={data}
      />
    );

    expect(screen.getByText("Multi Sprint Burndown")).toBeInTheDocument();
  });
});