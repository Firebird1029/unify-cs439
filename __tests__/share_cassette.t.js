/* eslint-disable react/jsx-filename-extension */

import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import UserPage from "@/app/user/[slug]/page";

import userData from "./userData.json";

// Mocking the supabase client and its methods
jest.mock("../src/utils/supabase/client", () => {
  return jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [
        {
          spotify_data: userData,
        },
      ],
      error: null,
    }),
  }));
});

jest.mock("@nivo/radar", () => ({
  ResponsiveRadar: () => (
    <div data-testid="mockResponsiveRadar">Mock Responsive Radar</div>
  ),
}));

jest.mock("@nivo/pie", () => ({
  ResponsivePie: () => (
    <div data-testid="mockResponsivePie">Mock Responsive Pie</div>
  ),
}));

// Mocking the navigator.share API
global.navigator.share = jest.fn();

global.Image = class {
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 50); // Simulate async image loading
  }
};

// Mock the getContext and other canvas methods
HTMLCanvasElement.prototype.getContext = () => ({
  drawImage: jest.fn(), // Mock drawImage to avoid jsdom type errors
  fillText: jest.fn(),
  clearRect: jest.fn(),
});

HTMLCanvasElement.prototype.toBlob = jest.fn((callback, type, quality) => {
  setTimeout(() => {
    callback(new Blob(["test"], { type }));
  }, 0);
});

beforeEach(() => {
  global.navigator.share = jest.fn(() => Promise.resolve());
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("shareCassette", () => {
  it("should attempt to share using navigator.share when image is ready", async () => {
    render(<UserPage params={{ slug: "testslug" }} />);

    // Wait for the button with specific text and style to appear in the document
    const shareButton = await screen.findByRole("button", {
      name: /share cassette/i,
    });

    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(navigator.share).toHaveBeenCalled();
    });

    // Check navigator.share is called with the expected parameters
    expect(navigator.share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Unify with me!",
        text: "Compare our stats on Uni.fy",
        url: expect.stringContaining("unify/"), // Check if URL is formed correctly
      }),
    );
  });
});
