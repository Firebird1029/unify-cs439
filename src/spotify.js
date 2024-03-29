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

async function getUserData(token) {
  return callSpotifyApi(token, "/me");
}

// EXAMPLE
async function getTopItems(
  token,
  type = "tracks",
  timeRange = "short_term",
  limit = "5",
) {
  return callSpotifyApi(
    token,
    `/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
  );
}

async function getTopGenres(token) {
  const genreFrequencies = {};

  const topArtists = await getTopItems(token, "artists", "medium_term", "25");

  // Iterate over each artist object
  topArtists.items.forEach((artist) => {
    // Extract genres array from each artist
    const { genres } = artist;

    // Iterate over genres array
    genres.forEach((genre) => {
      // Increment genre frequency count
      if (genre in genreFrequencies) {
        genreFrequencies[genre]++;
      } else {
        genreFrequencies[genre] = 1;
      }
    });
  });

  return genreFrequencies;
}

// Get the audio features of tracks based on their ids
async function getAudioFeatures(token, ids) {
  if (!ids) {
    throw new Error("Ids must be provided.");
  }

  return callSpotifyApi(token, `/audio-features?ids=${ids}`);
}

async function getAverageAudioFeatures(token) {
  const topSongs = await getTopItems(token, "tracks", "short_term", "5");

  const trackIds = topSongs.items.map((track) => track.id).join(",");

  const audioFeatureData = await getAudioFeatures(token, trackIds);

  const audioFeatures = audioFeatureData.audio_features;

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

  return featuresAvg;
}

async function getSpotifyData(token) {
  const userProfile = await getUserData(token);

  const averageAudioFeatures = await getAverageAudioFeatures(token);

  const featuresData = Object.keys(averageAudioFeatures).map((key) => ({
    feature: key,
    value: averageAudioFeatures[key],
  }));

  const topArtistsData = await getTopItems(
    token,
    "artists",
    "short_term",
    "25",
  );

  const topArtists = topArtistsData.items;

  const topSongsData = await getTopItems(token, "tracks", "short_term", "25");

  const topSongs = topSongsData.items;

  const topGenres = await getTopGenres(token);

  // Constructing the user data JSON
  const userData = {
    userProfile,
    featuresData,
    topArtists,
    topSongs,
    topGenres,
  };

  return userData;
}

function anotherSpotifyFunction() {
  // TODO this can be replaced with anything
}

export { getSpotifyData, anotherSpotifyFunction };
