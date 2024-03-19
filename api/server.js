/* eslint-disable no-console */
const express = require("express");

const axios = require("axios");

const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

/** ******
 * ! MIGRATE ALL THESE FUNCTIONS TO SPOTIFY.JS !
 ********* */

/** ******
 * this function has already been migrated
 ********* */
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

/** ******
 * this function has already been migrated
 ********* */
app.get("/getTopItems", async (req, res) => {
  const { token, type } = req.query;
  const timeRange = req.query.timeRange || "short_term";
  const limit = req.query.limit || 5;

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
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

module.exports = app;
