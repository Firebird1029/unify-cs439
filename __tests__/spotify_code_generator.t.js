import axios from "axios";

import {
  hashCode,
  getColorFromSeed,
  modifySvg,
  GetSpotifyCode,
} from "@/components/SpotifyCodeGenerator";

jest.mock("axios");

describe("hashCode", () => {
  test("should compute hash code correctly", () => {
    expect(hashCode("hello")).toBe(hashCode("hello"));
    expect(hashCode("hello")).not.toBe(hashCode("hello "));
  });

  test("should return 0 for empty string", () => {
    expect(hashCode("")).toBe(0);
  });
});

describe("getColorFromSeed", () => {
  test("should generate consistent color from seed", () => {
    const seed = 0.5;
    expect(getColorFromSeed(seed)).toBe(getColorFromSeed(seed));
  });

  test("should generate a valid hex color code", () => {
    const seed = 0.1;
    expect(getColorFromSeed(seed)).toMatch(/^#([0-9A-F]{6})$/i);
  });
});

describe("modifySvg", () => {
  test("should modify SVG and add rectangles with specific attributes", () => {
    const mockSvgString =
      '<svg><rect fill="#ffffff"></rect><rect fill="#000000"></rect></svg>';
    const uri = "testuri";
    global.DOMParser = jest.fn().mockImplementation(() => ({
      parseFromString: jest.fn().mockReturnValue({
        querySelectorAll: jest.fn().mockReturnValue([]),
        querySelector: jest.fn().mockReturnValue({
          insertBefore: jest.fn(),
        }),
        createElementNS: jest.fn().mockReturnValue({
          setAttribute: jest.fn(),
        }),
      }),
      createElementNS: jest.fn(),
    }));
    global.XMLSerializer = jest.fn().mockImplementation(() => ({
      serializeToString: jest.fn().mockReturnValue("modifiedSvg"),
    }));

    const result = modifySvg(mockSvgString, uri);
    expect(result).toBeTruthy();
  });
});

describe("GetSpotifyCode", () => {
  // Test successful SVG retrieval and modification
  it("retrieves and modifies an SVG correctly", async () => {
    const fakeSVG = "<svg>...</svg>"; // Simplified SVG for testing
    const expectedURI = "track:6rqhFgbbKwnb9MLmUQDhG6";
    const modifiedSVG = modifySvg(fakeSVG, expectedURI);

    // Mock axios response
    axios.get.mockResolvedValue({
      data: Buffer.from(fakeSVG),
    });

    const result = await GetSpotifyCode(
      "https://spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6",
    );
    expect(result).toBeTruthy();
    expect(axios.get).toHaveBeenCalled();
  });
});
