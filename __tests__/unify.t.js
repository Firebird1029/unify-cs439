import { render } from "@testing-library/react";

import {
  calculateGenreSimilarity,
  calculateArtistSimilarity,
  featureDataSimilarity,
  VinylCircle,
  GenrePieChart,
  UnifyContent,
} from "@/app/unify/[users]/UnifyContent";

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

describe("calculateGenreSimilarity", () => {
  test("returns 100% for identical genre lists", () => {
    const genresA = { rock: 5, jazz: 3 };
    const genresB = { rock: 5, jazz: 3 };
    expect(calculateGenreSimilarity(genresA, genresB)).toBe(100);
  });

  test("returns 0% for completely different genre lists", () => {
    const genresA = { rock: 5 };
    const genresB = { classical: 3 };
    expect(calculateGenreSimilarity(genresA, genresB)).toBe(0);
  });

  test("calculates correct percentage for partially overlapping genres", () => {
    const genresA = { rock: 5, jazz: 3 };
    const genresB = { rock: 5, blues: 2 };
    expect(calculateGenreSimilarity(genresA, genresB)).toBe(33);
  });
});

describe("calculateArtistSimilarity", () => {
  test("calculateArtistSimilarity calculates correct similarity", () => {
    const artists1 = ["Artist A", "Artist B", "Artist C"];
    const artists2 = ["Artist B", "Artist A", "Artist D"];
    expect(calculateArtistSimilarity(artists1, artists2)).toBe(20);
  });
});

describe("featureDataSimilarity", () => {
  test("featureDataSimilarity returns correct similarity", () => {
    const features1 = [{ value: 10 }, { value: 30 }];
    const features2 = [{ value: 10 }, { value: 40 }];
    expect(featureDataSimilarity(features1, features2)).toBe(90);
  });
});

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

describe("UnifyContent", () => {
  it("renders UnifyContent correctly with provided data", () => {
    render(<UnifyContent user1Data={userData} user2Data={userData} />);
  });
});
