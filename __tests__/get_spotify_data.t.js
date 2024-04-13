import axios from "axios";
import { getSpotifyData } from "../src/spotify";

jest.mock("axios");

describe("getSpotifyData", () => {
  const mockToken = "mockToken";

  beforeEach(() => {
    axios.get.mockClear();
  });

  test("should fetch user data and return formatted user data", async () => {
    const getUserDataSpy = jest.spyOn(axios, "get");
    getUserDataSpy.mockResolvedValueOnce({
      data: {},
    });

    const topArtistsShortDataSpy = jest.spyOn(axios, "get");
    topArtistsShortDataSpy.mockResolvedValueOnce({
      data: {
        items: [
          { genres: ["pop", "rock"] },
          { genres: ["pop", "jazz"] },
          { genres: ["rock", "hip-hop"] },
        ],
      },
    });
    const topArtistsMediumDataSpy = jest.spyOn(axios, "get");
    topArtistsMediumDataSpy.mockResolvedValueOnce({
      data: {
        items: [
          { genres: ["pop", "rock"] },
          { genres: ["pop", "jazz"] },
          { genres: ["rock", "hip-hop"] },
        ],
      },
    });
    const topArtistsLongDataSpy = jest.spyOn(axios, "get");
    topArtistsLongDataSpy.mockResolvedValueOnce({
      data: {
        items: [
          { genres: ["pop", "rock"] },
          { genres: ["pop", "jazz"] },
          { genres: ["rock", "hip-hop"] },
        ],
      },
    });

    const topSongsShortDataSpy = jest.spyOn(axios, "get");
    topSongsShortDataSpy.mockResolvedValueOnce({
      data: {},
    });
    const topSongsMediumDataSpy = jest.spyOn(axios, "get");
    topSongsMediumDataSpy.mockResolvedValueOnce({
      data: {},
    });
    const topSongsLongDataSpy = jest.spyOn(axios, "get");
    topSongsLongDataSpy.mockResolvedValueOnce({
      data: { items: Array(50).fill(0) },
    });

    // Spy on getAudioFeatures
    const getAudioFeaturesSpy = jest.spyOn(axios, "get");

    // Mock the implementation of axios.get
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

    const result = await getSpotifyData(mockToken);

    expect(axios.get).toHaveBeenCalledTimes(8);
    expect(axios.get).toHaveBeenCalledWith("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=25",
      {
        headers: { Authorization: `Bearer ${mockToken}` },
      },
    );
  });

  test("should throw an error if token is not provided", async () => {
    await expect(getSpotifyData()).rejects.toThrow("Token not provided.");
  });
});
