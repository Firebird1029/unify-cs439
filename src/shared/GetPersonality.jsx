/*
Function to calculate the personality of a user based on how close the features of their top songs
are to the 10 reference personalities using euclidean distance
*/
const colorPresets = {
  red: {
    bg: "#FF5555",
    light: "FFC8AA",
    dark: "#AD3D00",
    cassetteBody: "#FF5555",
    cassetteAccent: "#FFC8AA",
  },
  energetic: {
    bg: "#FF7448",
    light: "#FFC556",
    dark: "#7F5300",
    cassetteBody: "#FF6636",
    cassetteAccent: "#FFD98F",
  },
  green: {
    bg: "#46FF90",
    light: "#E0FFB8",
    dark: "#457B00",
    cassetteBody: "#588D00",
    cassetteAccent: "#E0FFB8",
  },
  midnight: {
    bg: "#C274FF",
    light: "#87B7FF",
    dark: "#003789",
    cassetteBody: "#4051E4",
    cassetteAccent: "#A2C2FF",
  },
  sunny: {
    bg: "#FFDC62",
    light: "#FFAE50",
    dark: "#965100",
    cassetteBody: "#ED8101",
    cassetteAccent: "#FFE589",
  },
  blue: {
    bg: "#5599FF",
    light: "#CADFFF",
    dark: "#2355A0",
    cassetteBody: "#5599FF",
    cassetteAccent: "#CADFFF",
  },
};

// the reference personalities
const personalities = [
  {
    name: "Indie Introvert 🎧",
    scores: {
      acousticness: 8,
      danceability: 3,
      popularity: 2,
      valence: 3,
      energy: 2,
      speechiness: 2,
      instrumentalness: 8,
    },
    colors: colorPresets.blue,
  },
  {
    name: "Partier 💃",
    scores: {
      acousticness: 2,
      danceability: 9,
      popularity: 9,
      valence: 9,
      energy: 9,
      speechiness: 5,
      instrumentalness: 1,
    },
    colors: colorPresets.energetic,
  },
  {
    name: "Vintage Soul 🍷",
    scores: {
      acousticness: 7,
      danceability: 4,
      popularity: 4,
      valence: 5,
      energy: 4,
      speechiness: 2,
      instrumentalness: 5,
    },
    colors: colorPresets.midnight,
  },
  {
    name: "Athlete 💪",
    scores: {
      acousticness: 2,
      danceability: 9,
      popularity: 6,
      valence: 8,
      energy: 10,
      speechiness: 3,
      instrumentalness: 2,
    },
    colors: colorPresets.red,
  },
  {
    name: "Lyricist 📝",
    scores: {
      acousticness: 7,
      danceability: 3,
      popularity: 4,
      valence: 4,
      energy: 4,
      speechiness: 8,
      instrumentalness: 3,
    },
    colors: colorPresets.sunny,
  },
  {
    name: "Explorer 🌳",
    scores: {
      acousticness: 5,
      danceability: 5,
      popularity: 5,
      valence: 5,
      energy: 5,
      speechiness: 5,
      instrumentalness: 5,
    },
    colors: colorPresets.green,
  },
  {
    name: "Chiller 🧊",
    scores: {
      acousticness: 9,
      danceability: 2,
      popularity: 3,
      valence: 7,
      energy: 3,
      speechiness: 2,
      instrumentalness: 8,
    },
    colors: colorPresets.blue,
  },
  {
    name: "Pop Buff 🕺",
    scores: {
      acousticness: 1,
      danceability: 9,
      popularity: 10,
      valence: 9,
      energy: 8,
      speechiness: 2,
      instrumentalness: 1,
    },
    colors: colorPresets.sunny,
  },
  {
    name: "Sad Romantic 💔",
    scores: {
      acousticness: 8,
      danceability: 3,
      popularity: 2,
      valence: 2,
      energy: 3,
      speechiness: 5,
      instrumentalness: 6,
    },
    colors: colorPresets.midnight,
  },
  {
    name: "Hummer 🎶",
    scores: {
      acousticness: 9,
      danceability: 4,
      popularity: 2,
      valence: 5,
      energy: 4,
      speechiness: 1,
      instrumentalness: 10,
    },
    colors: colorPresets.midnight,
  },
];

// get the closes personality
const getPersonality = (userData) => {
  let minDistance = Infinity;
  let closestPersonality = null;

  // process user data object and normalize
  const userScores = {
    acousticness:
      (userData.featuresData.find((f) => f.feature === "acousticness").value *
        10) /
      60,
    danceability:
      (userData.featuresData.find((f) => f.feature === "danceability").value *
        10) /
      60,
    popularity:
      (userData.featuresData.find((f) => f.feature === "popularity").value *
        10) /
      60,
    valence:
      (userData.featuresData.find((f) => f.feature === "valence").value * 10) /
      60,
    energy:
      (userData.featuresData.find((f) => f.feature === "energy").value * 10) /
      60,
    speechiness:
      (userData.featuresData.find((f) => f.feature === "speechiness").value *
        10) /
      60,
    instrumentalness:
      (userData.featuresData.find((f) => f.feature === "instrumentalness")
        .value *
        10) /
      60,
  };

  // find similarity between personality and user's data
  // uses euclidean distance
  personalities.forEach((personality) => {
    let distance = 0;
    Object.keys(personality.scores).forEach((key) => {
      distance += (personality.scores[key] - userScores[key]) ** 2;
    });
    distance = Math.sqrt(distance);

    if (distance < minDistance) {
      minDistance = distance;
      closestPersonality = personality;
    }
  });

  return closestPersonality;
};

export default getPersonality;
