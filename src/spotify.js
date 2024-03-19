import axios from "axios";

async function callSpotifyApi(token, endpoint) {
  if (!token) {
    throw new Error("Token not provided.");
  }

  const { data } = await axios.get(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

async function getSpotifyData(token) {
  return callSpotifyApi(token, "/me");
}

// EXAMPLE
async function getTopItems(token) {
  const type = "artists";
  const timeRange = "short_term";
  const limit = 5;

  return callSpotifyApi(
    token,
    `/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
  );
}

function anotherSpotifyFunction() {
  // TODO this can be replaced with anything
}

export { getSpotifyData, anotherSpotifyFunction };
