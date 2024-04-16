// Tests both error/error.jsx and error/page.jsx

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import * as nextNavigation from "next/navigation";
import ErrorAlert from "../src/app/error/error";
import ErrorPage from "../src/app/error/page";

// Need to mock window.location as JSDOM does not support doesn't implement it
const assignMock = jest.fn();
delete window.location;
window.location = { assign: assignMock };

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

describe("ErrorAlert", () => {
  test("redirects to the specified URL when close button is clicked", () => {
    const redirectUrl = "/user";
    render(
      <ErrorAlert
        Title="Error"
        Message="An error occurred"
        RedirectTo={redirectUrl}
      />,
    );

    const closeButton = document.querySelector('svg[role="button"]');
    fireEvent.click(closeButton);

    expect(window.location.href).toBe(redirectUrl);
  });
});

describe("ErrorAlert Component Tests", () => {
  // Test for proper rendering with props
  it("renders with given title and message", () => {
    render(<ErrorAlert Title="Error" Message="An error has occurred" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("An error has occurred")).toBeInTheDocument();
  });
});

describe("ErrorPage", () => {
  test("displays default error message when no error query parameter is provided", async () => {
    nextNavigation.useSearchParams.mockImplementation(() => {
      return new URLSearchParams();
    });

    const { findByText } = render(<ErrorPage />);
    // Need to use await for suspense
    const message = await findByText("An error occured.");
    expect(message).toBeInTheDocument();
  });

  test("displays custom error message when error query parameter is provided", async () => {
    nextNavigation.useSearchParams.mockImplementation(() => {
      const searchParams = new URLSearchParams();
      searchParams.set("error", "Custom error message");
      return searchParams;
    });

    const { findByText } = render(<ErrorPage />);
    // Need to use await for suspense
    const message = await findByText("Custom error message");
    expect(message).toBeInTheDocument();
  });
});
