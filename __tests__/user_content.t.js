import { render } from "@testing-library/react";

import UserContent, {
  VinylCircle,
  GenrePieChart,
} from "@/app/user/[slug]/UserContent";

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
  const mockData = [
    { id: "pov: indie", value: 21 },
    { id: "modern rock", value: 16 },
    { id: "pop", value: 12 },
    { id: "gen z singer-songwriter", value: 7 },
    { id: "bedroom pop", value: 6 },
  ];

  test("renders correctly with given props", () => {
    const { getByTestId } = render(
      <GenrePieChart data={mockData} centerCircleColor="black" />,
    );
    const svg = getByTestId("GenrePieChart");
    expect(svg).toBeTruthy();
  });
});

const mockShareCassette = jest.fn();

describe("UnifyContent", () => {
  it("renders UnifyContent correctly with provided data", () => {
    render(
      <UserContent userData={userData} shareCassette={mockShareCassette} />,
    );
  });
});
