/*
Function to calculate the personality of a user based on how close the features of their top songs
are to the 10 reference personalities using euclidean distance
*/

// the reference personalities
const personalities = [
  {
    name: "Indie Introvert",
    scores: {
      acousticness: 8,
      danceability: 3,
      popularity: 2,
      valence: 3,
      energy: 2,
      speechiness: 2,
      instrumentalness: 8,
    },
    colors: {
      bg: "#488bff",
      light: "#56e8ff",
      dark: "#00447f",
    },
  },
  {
    name: "Party Enthusiast",
    scores: {
      acousticness: 2,
      danceability: 9,
      popularity: 9,
      valence: 9,
      energy: 9,
      speechiness: 5,
      instrumentalness: 1,
    },
    colors: {
      bg: "#ff5a48",
      light: "#ffd256",
      dark: "#7f0000",
    },
  },
  {
    name: "Vintage Soul",
    scores: {
      acousticness: 7,
      danceability: 4,
      popularity: 4,
      valence: 5,
      energy: 4,
      speechiness: 2,
      instrumentalness: 5,
    },
    colors: {
      bg: "#48ff5a",
      light: "#94ff56",
      dark: "#157f00",
    },
  },
  {
    name: "Energetic Fitness Buff",
    scores: {
      acousticness: 2,
      danceability: 9,
      popularity: 6,
      valence: 8,
      energy: 10,
      speechiness: 3,
      instrumentalness: 2,
    },
    colors: {
      bg: "#ffbc48",
      light: "#ffe656",
      dark: "#7f3d00",
    },
  },
  {
    name: "Thoughtful Lyricist",
    scores: {
      acousticness: 7,
      danceability: 3,
      popularity: 4,
      valence: 4,
      energy: 4,
      speechiness: 8,
      instrumentalness: 3,
    },
    colors: {
      bg: "#ff9448",
      light: "#ffcc56",
      dark: "#7f5000",
    },
  },
  {
    name: "Eclectic Explorer",
    scores: {
      acousticness: 5,
      danceability: 5,
      popularity: 5,
      valence: 5,
      energy: 5,
      speechiness: 5,
      instrumentalness: 5,
    },
    colors: {
      bg: "#48ff76",
      light: "#abff56",
      dark: "#177f00",
    },
  },
  {
    name: "Chillout Aficionado",
    scores: {
      acousticness: 9,
      danceability: 2,
      popularity: 3,
      valence: 7,
      energy: 3,
      speechiness: 2,
      instrumentalness: 8,
    },
    colors: {
      bg: "#48c5ff",
      light: "#566dff",
      dark: "#00337f",
    },
  },
  {
    name: "Pop Connoisseur",
    scores: {
      acousticness: 1,
      danceability: 9,
      popularity: 10,
      valence: 9,
      energy: 8,
      speechiness: 2,
      instrumentalness: 1,
    },
    colors: {
      bg: "#ff4848",
      light: "#ff7856",
      dark: "#7f0b00",
    },
  },
  {
    name: "Melancholic Romantic",
    scores: {
      acousticness: 8,
      danceability: 3,
      popularity: 2,
      valence: 2,
      energy: 3,
      speechiness: 5,
      instrumentalness: 6,
    },
    colors: {
      bg: "#ff48f9",
      light: "#ff56eb",
      dark: "#6e007f",
    },
  },
  {
    name: "Instrumental Guru",
    scores: {
      acousticness: 9,
      danceability: 4,
      popularity: 2,
      valence: 5,
      energy: 4,
      speechiness: 1,
      instrumentalness: 10,
    },
    colors: {
      bg: "#4870ff",
      light: "#56e8ff",
      dark: "#19007f",
    },
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
