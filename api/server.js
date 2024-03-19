/* eslint-disable no-console */
const express = require("express");

const axios = require("axios");

const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/getUserProfile", async (req, res) => {
  const { token } = req.query; // Assuming the token is passed as a query parameter

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json({ profile: data });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).send("Error fetching user profile.");
  }
});

app.get("/getTopItems", async (req, res) => {
  const { token, type } = req.query;
  const timeRange = req.query.timeRange || "short_term";
  const limit = req.query.limit || 5;

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
    console.log(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
    );
    const { data } = await axios.get(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.json({ topItems: data.items });
  } catch (error) {
    console.error("Error fetching top items:", error);
    return res.status(500).send("Error fetching top items.");
  }
});

app.get("/getRecommendations", async (req, res) => {
  const { token } = req.query;
  const limit = req.query.limit || 10;
  const seedGenres = req.query.seed_genres;
  const seedArtists = req.query.seed_artists;
  const seedTracks = req.query.seed_tracks;

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  let queryParams = `limit=${limit}`;

  if (seedGenres)
    queryParams += `&seed_genres=${encodeURIComponent(seedGenres)}`;
  if (seedArtists)
    queryParams += `&seed_artists=${encodeURIComponent(seedArtists)}`;
  if (seedTracks)
    queryParams += `&seed_tracks=${encodeURIComponent(seedTracks)}`;

  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/recommendations?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.json(data);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).send("Error fetching recommendations.");
  }
});

app.get("/getAudioFeatures", async (req, res) => {
  const { token, ids } = req.query;

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(ids)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.json(data);
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return res.status(500).send("Error fetching audio features");
  }
});

app.get("/getAverageAudioFeatures", async (req, res) => {
  const { token } = req.query;

  // console.log("getting average audio features");

  // console.log(token);

  if (!token) {
    return res.status(400).json({ error: "Token not provided." });
  }

  try {
    // const songs = null;
    const songs = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // console.log(songs.data);

    if (!songs) {
      console.error("Failed to fetch top items");
      return res.status(500).send("Failed to fetch top items");
    }

    const trackIds = songs.data.items.map((track) => track.id).join(",");

    const { data } = await axios.get(
      `https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(trackIds)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const audioFeatures = data.audio_features;

    const featuresSum = audioFeatures.reduce(
      (acc, feature) => {
        acc.acousticness += feature.acousticness;
        acc.danceability += feature.danceability;
        acc.energy += feature.energy;
        acc.instrumentalness += feature.instrumentalness;
        acc.speechiness += feature.speechiness;
        acc.valence += feature.valence;
        return acc;
      },
      {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        speechiness: 0,
        valence: 0,
      },
    );

    const featuresAvg = Object.keys(featuresSum).reduce((acc, key) => {
      acc[key] = (featuresSum[key] * 100) / audioFeatures.length;
      return acc;
    }, {});

    return res.json(featuresAvg);
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return res.status(500).send("Error fetching audio features");
  }
});

app.get("/getUserData", async (req, res) => {
  const { token } = req.query; // Assuming the token is passed as a query parameter

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
    const userProfileResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/getUserProfile?token=${token}`,
    );

    const userProfile = userProfileResponse.data.profile;

    // console.log("user profile: ", userProfileResponse);

    // Fetch average audio features
    const averageAudioFeaturesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/getAverageAudioFeatures?token=${token}`,
    );
    const averageAudioFeatures = averageAudioFeaturesResponse.data;

    const featuresData = Object.keys(averageAudioFeatures).map((key) => ({
      feature: key,
      value: averageAudioFeatures[key],
    }));

    // Fetch top artists
    const topArtistsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=artists`,
    );

    const topArtists = topArtistsResponse.data.topItems;

    // Fetch top songs
    const topSongsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=tracks`,
    );

    const topSongs = topSongsResponse.data.topItems;

    // Constructing the user data JSON
    const userData = {
      userProfile,
      featuresData,
      topArtists,
      topSongs,
    };

    return res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).send("Error fetching user data.");
  }
});

module.exports = app;
