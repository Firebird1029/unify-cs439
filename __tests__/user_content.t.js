/* eslint-disable react/jsx-filename-extension */

import { render, fireEvent, waitFor } from "@testing-library/react";

import UserContent, {
  VinylCircle,
  GenrePieChart,
} from "@/components/svg-art/user_content";

import userData from "./userData.json";

class MockImage {
  constructor() {
    setTimeout(() => this.onload(), 100); // Ensure onload is called
  }

  src = "";
}

global.Image = MockImage;

const mockGetContext = jest.fn(() => ({
  drawImage: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
  clearRect: jest.fn(),
}));

global.HTMLCanvasElement.prototype.getContext = mockGetContext;

global.navigator.share = jest.fn(() => Promise.resolve());

// mock nivio because it was causing jest issues
jest.mock("@nivo/radar", () => ({ ResponsiveRadar: () => "ResponsiveRadar" }));
jest.mock("@nivo/pie", () => ({ ResponsivePie: () => "ResponsivePie" }));

describe("VinylCircle Component", () => {
  test("renders correctly with given props", () => {
    const { getByTestId } = render(
      <VinylCircle centerCircleColor="black" width={300} />,
    );
    const svg = getByTestId("VinylCircle");
    expect(svg).toBeTruthy();
  });
});

describe("GenrePieChart Component", () => {
  const mockData = {
    topGenres: [
      { id: "rock", value: 10 },
      { id: "jazz", value: 20 },
    ],
  };

  test("renders correctly with given props", () => {
    const { getByTestId } = render(
      <GenrePieChart data={mockData} centerCircleColor="black" />,
    );
    const svg = getByTestId("GenrePieChart");
    expect(svg).toBeTruthy();
  });
});

describe("UnifyContent", () => {
  it("renders UnifyContent correctly with provided data", () => {
    const { getByText } = render(<UserContent userData={userData} />);
  });
});
