import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorAlert from "@/app/error/error";

describe("ErrorAlert Component Tests", () => {
  // Test for proper rendering with props
  it("renders with given title and message", () => {
    render(<ErrorAlert Title="Error" Message="An error has occurred" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("An error has occurred")).toBeInTheDocument();
  });
});
