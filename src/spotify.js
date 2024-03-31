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

// Get the audio features of tracks based on their ids
async function getAudioFeatures(token, ids) {
  if (!ids) {
    throw new Error("Ids must be provided.");
  }

  return callSpotifyApi(token, `/audio-features?ids=${ids}`);
}

async function getAverageAudioFeatures(token, topSongs) {
  const trackIds = topSongs.items.map((track) => track.id).join(",");

  const popularitySum = topSongs.items.reduce(
    (acc, song) => acc + song.popularity,
    0,
  );

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

  featuresAvg.popularity = popularitySum / audioFeatures.length;

  return featuresAvg;
}

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

  // top Genres (across all terms)
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

function anotherSpotifyFunction() {
  // TODO this can be replaced with anything
}

export { getSpotifyData, anotherSpotifyFunction };
