import React from "react";
import { render, screen } from "@testing-library/react";
import BurndownChartVisualization from "./BurndownChartVisualization";

describe("BurndownChartVisualization Component", () => {
  it("renders loading chart initially", () => {
    render(<BurndownChartVisualization metricData={{ days: [] }} />);

    // Assert that loading chart message is rendered
    expect(screen.getByText("Loading Chart...")).toBeInTheDocument();
  });
});
