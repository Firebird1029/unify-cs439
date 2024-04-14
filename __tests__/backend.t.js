import axios from "axios";
import {
  callSpotifyApi,
  getUserData,
  getTopGenres,
  getAudioFeatures,
  getTopItems,
} from "../src/spotify";

// Mocking axios
jest.mock("axios");

describe("Spotify API functions", () => {
  describe("callSpotifyApi", () => {
    test("calls axios.get with correct parameters", async () => {
      const token = "testToken";
      const endpoint = "/me";
      const responseData = { data: "testData" };
      axios.get.mockResolvedValue(responseData);

      const result = await callSpotifyApi(token, endpoint);

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.spotify.com/v1${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      expect(result).toEqual(responseData.data);
    });

    test("throws an error if token is not provided", async () => {
      const token = "";
      const endpoint = "/me";

      await expect(callSpotifyApi(token, endpoint)).rejects.toThrow(
        "Token not provided.",
      );
    });

    test("throws an error if response is not valid", async () => {
      const token = "testToken";
      const endpoint = "/me";
      const responseData = null;
      axios.get.mockResolvedValue({ data: responseData });

      await expect(callSpotifyApi(token, endpoint)).rejects.toThrow(
        "Unable to fetch data from Spotify API.",
      );
    });

    test("throws an error if there is an error during API call", async () => {
      const token = "testToken";
      const endpoint = "/me";
      const errorMessage = "Failed to fetch data";
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(callSpotifyApi(token, endpoint)).rejects.toThrow(
        `Error fetching data from Spotify API: ${errorMessage}`,
      );
    });
  });

  describe("getTopGenres", () => {
    test("correctly counts genre frequencies", () => {
      const topArtists = [
        { genres: ["pop", "rock"] },
        { genres: ["pop", "jazz"] },
        { genres: ["rock", "hip-hop"] },
      ];

      const result = getTopGenres(topArtists);

      expect(result).toEqual({ pop: 2, rock: 2, jazz: 1, "hip-hop": 1 });
    });
  });

  describe("getAudioFeatures", () => {
    test("throws an error if ids", async () => {
      const token = "";
      await expect(getAudioFeatures(token)).rejects.toThrow(
        "Ids must be provided.",
      );
    });
  });

  describe("getUserData", () => {
    test("returns user data when token is provided", async () => {
      const token = "testToken";
      const userData = { id: "user123", display_name: "Test User" };
      axios.get.mockResolvedValue({ data: userData });

      const result = await getUserData(token);

      expect(result).toEqual(userData);
      expect(axios.get).toHaveBeenCalledWith("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  });

  describe("getTopItems", () => {
    test("returns top items when token is provided", async () => {
      const token = "testToken";
      const type = "tracks";
      const timeRange = "short_term";
      const limit = "5";
      const topItemsData = [
        { id: "track1", name: "Track 1" },
        { id: "track2", name: "Track 2" },
      ];
      axios.get.mockResolvedValue({ data: topItemsData });

      const result = await getTopItems(token, type, timeRange, limit);

      expect(result).toEqual(topItemsData);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    });
  });
});
