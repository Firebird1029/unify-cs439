/* eslint-disable react/jsx-filename-extension */

// Import necessary utilities from React Testing Library
import React from "react";
import { render } from "@testing-library/react";

// Import the component to be tested
import HomePage from "../src/app/Index"; // Adjust the import path to your actual file location

// Jest snapshot test
describe("Index Component", () => {
  it("matches the snapshot", () => {
    const { asFragment } = render(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
