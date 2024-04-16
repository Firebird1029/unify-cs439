import axios from "axios";
import { getAverageAudioFeatures } from "../src/spotify";

// Mocking axios
jest.mock("axios");

describe("Spotify API functions", () => {
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

      // Spy on getAudioFeatures
      const getAudioFeaturesSpy = jest.spyOn(axios, "get");

      // Mock the implementation of axios.get to return a resolved promise with dummy data
      getAudioFeaturesSpy.mockResolvedValueOnce({
        data: {
          audio_features: [
            {
              acousticness: 0.5,
              danceability: 0.7,
              energy: 0.8,
              instrumentalness: 0.3,
              speechiness: 0.4,
              valence: 0.6,
            },
            {
              acousticness: 0.4,
              danceability: 0.6,
              energy: 0.7,
              instrumentalness: 0.2,
              speechiness: 0.5,
              valence: 0.8,
            },
          ],
        },
      });

      await getAverageAudioFeatures(token, topSongs);

      // Assert that getAudioFeatures was called with the correct parameters
      expect(getAudioFeaturesSpy).toHaveBeenCalledWith(
        expect.stringContaining("id1,id2"),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
    });

    test("throws an error when unable to fetch audio features", async () => {
      const token = "testToken";
      const topSongs = {
        items: [
          { id: "id1", popularity: 70 },
          { id: "id2", popularity: 80 },
        ],
      };

      // Mocking the axios.get to return a rejected promise
      axios.get.mockRejectedValueOnce(
        new Error("Failed to fetch audio features"),
      );

      await expect(getAverageAudioFeatures(token, topSongs)).rejects.toThrow(
        "Error fetching data from Spotify API: Failed to fetch audio features",
      );
    });

    test("throws an error when audio_features is undefined", async () => {
      const token = "testToken";
      const topSongs = {
        items: [
          { id: "id1", popularity: 70 },
          { id: "id2", popularity: 80 },
        ],
      };

      const getAudioFeaturesSpy = jest.spyOn(axios, "get");

      getAudioFeaturesSpy.mockResolvedValueOnce({
        data: { audio_features: undefined },
      });

      await expect(getAverageAudioFeatures(token, topSongs)).rejects.toThrow(
        "Unable to fetch audio features.",
      );
    });
  });
});
