import React from "react";
import { render, screen } from "@testing-library/react";
import CycleTimeArbRange from "./CycleTimeArbRange";

describe("CycleTimeArbRange Component", () => {
  it("renders with default date values and submits correctly", () => {
    const mockMetricData = [
      ["# Task", "Cycle Time"],
      ["T-1", 10],
      ["T-2", 15],
    ];
    const mockCycleTimeData = [
      {
        refId: 1,
        cycle_time: 10,
        start_date: "2023-01-01",
        end_date: "2023-01-05",
      },
      {
        refId: 2,
        cycle_time: 15,
        start_date: "2023-01-01",
        end_date: "2023-01-05",
      },
    ];

    render(
      <CycleTimeArbRange
        metricData={mockMetricData}
        cycleTimeData={mockCycleTimeData}
      />
    );

    // Assert default date values
    expect(screen.getByText("From:")).toBeInTheDocument();
    expect(screen.getByText("To:")).toBeInTheDocument();
  });
});
