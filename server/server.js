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
    res.json({ profile });
  } else {
    res.status(500).send("Error fetching user profile.");
  }
});

app.listen(5000, () => {
  console.log("app listening on port 5000");
});
