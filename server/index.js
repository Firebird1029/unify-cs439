const express = require("express");

const axios = require("axios");

const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const getUserProfile = async (token) => {
  if (!token) {
    console.error("Token not available. Please log in.");
    return null; // or throw an error
  }

  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(data);
    console.log(`user profile uri: ${data.uri}`);
    return data; // return the profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null; // or throw an error
  }
};

const FetchTopItems = async (
  token,
  limit = 5,
  TimeRange = "long_term",
  type = "artists",
) => {
  if (!token) {
    const errorMessage = "Token not available. Please log in.";
    console.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }

  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${TimeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data.items;
  } catch (error) {
    console.error(`Error fetching top ${type}:`, error);
    return Promise.reject(error);
  }
};

app.get("/getUserProfile", async (req, res) => {
  console.log("get user profile was called");

  const { token } = req.query; // Assuming the token is passed as a query parameter

  console.log("Received token", token);

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  const profile = await getUserProfile(token);

  console.log("Profile: ", profile);

  if (profile) {
    return res.json({ profile });
  }

  return res.status(500).send("Error fetching user profile.");
});

app.get("/getTopItems", async (req, res) => {
  console.log("get top items was called");

  const { token, type } = req.query;

  console.log("Received token", token);
  console.log("Received type", type);

  if (!token) {
    return res.status(400).send("Token not provided.");
  }

  try {
    const topItems = await FetchTopItems(token, 5, "short_term", type);

    console.log("Top Items: ", topItems);

    return res.json({ topItems });
  } catch (error) {
    console.error("Error fetching top items:", error);
    return res.status(500).send("Error fetching top items.");
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`app listening on port ${process.env.PORT || 3001}`);
});
