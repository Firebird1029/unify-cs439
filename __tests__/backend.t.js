import axios from "axios";
import {
  callSpotifyApi,
  getUserData,
  getTopGenres,
  getAudioFeatures,
  getAverageAudioFeatures,
} from "../src/spotify";

// Mocking axios
jest.mock("axios");

// Mocking getAudioFeatures to avoid actual API calls
jest.mock("../src/spotify", () => ({
  ...jest.requireActual("../src/spotify"),
  getAudioFeatures: jest.fn(),
}));

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

  describe("getAverageAudioFeatures", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("calls getAudioFeatures with correct parameters", async () => {
      const token = "testToken";
      const topSongs = {
        items: [
          { id: "id1", popularity: 70 },
          { id: "id2", popularity: 80 },
        ],
      };

      await getAverageAudioFeatures(token, topSongs);

      expect(getAudioFeatures).toHaveBeenCalledWith(token, ["id1", "id2"]);
    });

    test("calculates average audio features correctly", async () => {
      const token = "testToken";
      const topSongs = {
        items: [
          { id: "id1", popularity: 70 },
          { id: "id2", popularity: 80 },
        ],
      };

      // Mocking getAudioFeatures response
      getAudioFeatures.mockResolvedValueOnce({
        audio_features: [
          {
            acousticness: 0.5,
            danceability: 0.6,
            energy: 0.7,
            instrumentalness: 0.8,
            speechiness: 0.9,
            valence: 0.1,
          },
          {
            acousticness: 0.4,
            danceability: 0.7,
            energy: 0.8,
            instrumentalness: 0.9,
            speechiness: 0.6,
            valence: 0.2,
          },
        ],
      });

      const result = await getAverageAudioFeatures(token, topSongs);

      // Ensure that the result matches the expected average audio features
      expect(result).toEqual({
        acousticness: 0.45,
        danceability: 0.65,
        energy: 0.75,
        instrumentalness: 0.85,
        speechiness: 0.75,
        valence: 0.15,
        popularity: 75,
      });
    });

    test("handles errors properly", async () => {
      const token = "testToken";
      const topSongs = {
        items: [],
      };

      // Mocking getAudioFeatures function to throw an error
      getAudioFeatures.mockRejectedValue(new Error("Ids must be provided."));

      await expect(getAverageAudioFeatures(token, topSongs)).rejects.toThrow(
        "Ids must be provided.",
      );
    });
  });
});
