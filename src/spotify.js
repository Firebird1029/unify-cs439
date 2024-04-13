/*
Backend API used to get user data from Spotify and store it in Supabase after logging in.
*/

import axios from "axios";

// Call the spotify API using the token and endpoint passed to the function.
async function callSpotifyApi(token, endpoint) {
  if (!token) {
    throw new Error("Token not provided.");
  }

  try {
    // use axios to call spotify api
    const response = await axios.get(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response is valid
    if (!response.data) {
      throw new Error("Unable to fetch data from Spotify API.");
    }

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data from Spotify API: ${error.message}`);
  }
}

// Get the user data object from Spotify from /me Spotify API endpoint.
async function getUserData(token) {
  return callSpotifyApi(token, "/me");
}

// Get the top items for the user.
// Type options: "tracks", "artists"
// Time range options: "short_term" (1 month), "medium_term" (6 months), "long_term" (1 year)
// Limit: sets the number of items returned, can be 1-50
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

// Calculates the frequency of each genre listed for the user's top artists to get the top genres for the user.
function getTopGenres(topArtists) {
  const genreFrequencies = {};

  // Iterate over each artist object
  topArtists.forEach((artist) => {
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

// Get the audio features of tracks based on their track IDs.
async function getAudioFeatures(token, ids) {
  if (!ids) {
    throw new Error("Ids must be provided.");
  }

  return callSpotifyApi(token, `/audio-features?ids=${ids}`);
}

// averages the audio features for the user's top songs
async function getAverageAudioFeatures(token, topSongs) {
  const trackIds = topSongs.items.map((track) => track.id).join(",");

  // get audio features for the user's top songs
  const audioFeatureData = await getAudioFeatures(token, trackIds);

  // Check if audioFeatureData is undefined or audio_features is undefined
  if (!audioFeatureData || !audioFeatureData.audio_features) {
    throw new Error("Unable to fetch audio features.");
  }

  const audioFeatures = audioFeatureData.audio_features;

  // sum the audio features for each song
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

  // average the audio features
  const featuresAvg = Object.keys(featuresSum).reduce((acc, key) => {
    acc[key] = (featuresSum[key] * 100) / audioFeatures.length;
    return acc;
  }, {});

  // calculate average song popularity
  featuresAvg.popularity =
    topSongs.items.reduce((acc, song) => acc + song.popularity, 0) /
    topSongs.items.length;

  return featuresAvg;
}

// Constructs the user data object.
async function getSpotifyData(token) {
  // User Profile
  const userProfile = await getUserData(token);

  // Artist Data
  const topArtistsShortData = await getTopItems(
    token,
    "artists",
    "short_term",
    "25",
  );
  const topArtistsMediumData = await getTopItems(
    token,
    "artists",
    "medium_term",
    "25",
  );
  const topArtistsLongData = await getTopItems(
    token,
    "artists",
    "long_term",
    "25",
  );

  const topArtists = topArtistsShortData.items;
  const topArtistsMedium = topArtistsMediumData.items;
  const topArtistsLong = topArtistsLongData.items;

  // Song Data
  const topSongsShortData = await getTopItems(
    token,
    "tracks",
    "short_term",
    "25",
  );
  const topSongsMediumData = await getTopItems(
    token,
    "tracks",
    "medium_term",
    "25",
  );
  const topSongsLongData = await getTopItems(
    token,
    "tracks",
    "long_term",
    "50",
  );

  const topSongs = topSongsShortData.items;
  const topSongsMedium = topSongsMediumData.items;
  const topSongsLong = topSongsLongData.items.slice(0, 25);

  // Audio Features
  const averageAudioFeatures = await getAverageAudioFeatures(
    token,
    topSongsLongData,
  );

  const featuresData = Object.keys(averageAudioFeatures).map((key) => ({
    feature: key,
    value: averageAudioFeatures[key],
  }));

  // Top Genres (across all terms)
  const combinedArtists = [
    ...topArtists,
    ...topArtistsMedium,
    ...topArtistsLong,
  ];
  const topGenres = getTopGenres(combinedArtists);

  // Constructing the user data JSON
  const userData = {
    userProfile,
    featuresData,
    topArtists,
    topArtistsMedium,
    topArtistsLong,
    topSongs,
    topSongsMedium,
    topSongsLong,
    topGenres,
  };

  return userData;
}

export {
  getSpotifyData,
  callSpotifyApi,
  getUserData,
  getTopGenres,
  getAudioFeatures,
  getAverageAudioFeatures,
  getTopItems,
};
