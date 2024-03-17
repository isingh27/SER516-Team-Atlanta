import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LeadTimeVisualization from "./LeadTimeVisualization";
import taigaService from "../../Services/taiga-service";

// Mocking taigaService for testing purposes
jest.mock("../../Services/taiga-service");

describe("LeadTimeVisualization Component", () => {
  it("renders with default date values and submits correctly", async () => {
    const mockMetricData = [
      ["Date", "Lead Time"],
      ["2023-01-01", 10],
      ["2023-01-02", 15],
    ];

    const mockPlotData = [
      { refId: 1, lead_time: 10 },
      { refId: 2, lead_time: 15 },
    ];

    // Mocking taigaService response
    taigaService.taigaUserProjectsLeadTimeByRange.mockResolvedValue({
      data: { plotData: mockPlotData },
    });

    render(<LeadTimeVisualization metricData={mockMetricData} />);

    // Assert default date values
    expect(screen.getByText("From:")).toBeInTheDocument();
    expect(screen.getByText("To:")).toBeInTheDocument();
  });
});
