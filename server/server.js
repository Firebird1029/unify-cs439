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
  console.log("get user profile was called");

  const { token } = req.query; // Assuming the token is passed as a query parameter

  console.log("Received token", token);

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(data);
    console.log(`user profile uri: ${data.uri}`);

    console.log("Profile: ", data);
    return res.json({ profile: data });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).send("Error fetching user profile.");
  }
});


app.get("/getTopItems", async (req, res) => {
  console.log("get top items was called");

  const { token, type } = req.query;
  const timeRange = req.query.timeRange || "short_term";
  const limit = req.query.limit || 5;

  console.log("token:", token);
  console.log("type:", type);
  console.log("timeRange:", timeRange);
  console.log("limit:", limit);

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

    console.log("Top Items: ", data.items);

    return res.json({ topItems: data.items });

  } catch (error) {
    console.error("Error fetching top items:", error);
    return res.status(500).send("Error fetching top items.");
  }
});


app.get("/getRecommendations", async (req, res) => {
  console.log("get recommendations was called");

  const { token } = req.query;
  const limit = req.query.limit || 10;
  const seedGenres = req.query.seed_genres;
  const seedArtists = req.query.seed_artists;
  const seedTracks = req.query.seed_tracks;

  console.log("token:", token);
  console.log("limit:", limit);
  console.log("seed genres:", seedGenres);
  console.log("seed artists:", seedArtists);
  console.log("seed tracks:", seedTracks);

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  let queryParams = `limit=${limit}`;
  
  if (seedGenres) queryParams += `&seed_genres=${encodeURIComponent(seedGenres)}`;
  if (seedArtists) queryParams += `&seed_artists=${encodeURIComponent(seedArtists)}`;
  if (seedTracks) queryParams += `&seed_tracks=${encodeURIComponent(seedTracks)}`;

  try {
    const { data } = await axios.get(`https://api.spotify.com/v1/recommendations?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Recommendations: ", data);
    return res.json(data);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).send("Error fetching recommendations.");
  }
});

module.exports = app;
