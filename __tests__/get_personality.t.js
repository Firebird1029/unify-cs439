import getPersonality from "@/shared/GetPersonality";

// mock function to create user data
const createUserData = (
  acousticness,
  danceability,
  popularity,
  valence,
  energy,
  speechiness,
  instrumentalness,
) => ({
  featuresData: [
    { feature: "acousticness", value: acousticness },
    { feature: "danceability", value: danceability },
    { feature: "popularity", value: popularity },
    { feature: "valence", value: valence },
    { feature: "energy", value: energy },
    { feature: "speechiness", value: speechiness },
    { feature: "instrumentalness", value: instrumentalness },
  ],
});

describe("getPersonality", () => {
  it("should return a personality with both name and colors", () => {
    const userData = createUserData(60, 18, 12, 18, 12, 12, 48);
    const result = getPersonality(userData);
    expect(typeof result.name).toBe("string"); // Checks that the name is a string
    expect(typeof result.colors).toBe("object"); // Checks that the colors is an object
  });
});
