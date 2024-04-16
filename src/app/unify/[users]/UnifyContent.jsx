/*
This file contains the content that is displayed on the Unify page.
*/

/* eslint-disable no-alert */

import { ResponsiveRadar } from "@nivo/radar";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import GenrePieChart from "@/shared/GenrePieChart";
import ShareUnify from "@/app/unify/[users]/ShareUnify";
import "@/app/globals.css";
import Cassette from "@/app/user/[slug]/Cassette";
import getPersonality from "@/shared/GetPersonality";
import Boombox from "@/app/unify/[users]/Boombox";
import CDStack from "@/app/user/[slug]/CDStack";

// Find percent match between two lists
function calculateGenreSimilarity(list1, list2) {
  const intersection = Object.keys(list1).filter((key) =>
    Object.prototype.hasOwnProperty.call(list2, key),
  ).length;
  const union = Object.keys({ ...list1, ...list2 }).length;
  const similarity = intersection / union;
  return Math.round(similarity * 100); // Convert to percentage
}

// check how far away matching top artists are from each other in top artists list to compute artist similarity
function calculateArtistSimilarity(list1, list2) {
  const maxLength = Math.max(list1.length, list2.length);
  let Similarity = 0;
  // loop through artists in list1 and check if the artist is contained in list 2
  for (let i = 0; i < maxLength; i++) {
    if (list2.includes(list1[i])) {
      const j = list2.indexOf(list1[i]);
      // increase simililarity score based on how close artists are in the two lists
      // ex. same top 1 artist gives higher score than same 25th top artist
      Similarity += 1 / (Math.abs(i - j) + 1) / 5;
    }
  }
  return Math.min(Similarity * 100, 100);
}

// calculates the similarities between the song features for two users,
// where feature1 and feature2 are just an array of objects with feature and value
function featureDataSimilarity(features1, features2) {
  if (features1.length !== features2.length) {
    throw new Error("Arrays must have the same length");
  }
  let totalDifference = 0;
  for (let i = 0; i < features1.length; i++) {
    // get difference between two scores for each feature
    totalDifference += Math.abs(features1[i].value - features2[i].value);
  }

  // calculate song feature similarity by squaring average difference in song feaure
  return Math.round((1 - totalDifference / features1.length / 100) ** 2 * 100);
}

// calculate percent match between the two users by combining gere similarity, feature similarity, and artist similarity
function percentMatch(user1, user2) {
  const genreSimilarity = calculateGenreSimilarity(
    user1.topGenres,
    user2.topGenres,
  );
  const featureSimilarity = featureDataSimilarity(
    user1.featuresData,
    user2.featuresData,
  );
  const artistSimilarity = calculateArtistSimilarity(
    user1.topArtists.map((artist) => artist.name),
    user2.topArtists.map((artist) => artist.name),
  );
  // get average of the three scores
  return Math.round(
    (genreSimilarity + featureSimilarity + artistSimilarity) / 3,
  );
}

// main function of page which returns the content of unifying the data of two users
function UnifyContent({ user1Data, user2Data }) {
  // preload fonts to fix bug
  async function loadFonts() {
    try {
      await Promise.all([
        document.fonts.load("20px Koulen"),
        document.fonts.load("16px HomemadeApple"),
      ]);
    } catch (error) {
      // console.error("Error loading fonts", error);
    }
  }

  loadFonts();

  const user1personality = getPersonality(user1Data); // get user1personality

  const user2personality = getPersonality(user2Data); // get user2personality

  // Function to handle sharing, allows you to share your results when you click the share results button
  const shareUnify = async () => {
    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(
      <ShareUnify user1Data={user1Data} user2Data={user2Data} />,
    );

    const img = new Image();

    // Set the source of the image
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    // Wait for the image to load
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add canvas to the document body for debugging
      // document.body.appendChild(canvas);

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      canvas.getContext("2d")?.drawImage(img, 0, 0);

      ctx.textAlign = "center";

      // Render the text onto the canvas
      ctx.font = "16px HomemadeApple";
      ctx.fillStyle = "black";
      ctx.fillText(
        `@${user2Data.userProfile.display_name}`,
        canvas.width / 2,
        300,
      );
      ctx.fillText(
        `@${user1Data.userProfile.display_name}`,
        canvas.width / 2,
        502,
      );

      ctx.font = `20px Koulen`;
      ctx.fillStyle = `${user1personality.colors.cassetteAccent}`;
      ctx.fillText(`#${user1personality.name}`, canvas.width / 2, 378);

      ctx.font = `35px Koulen`;
      ctx.fillStyle = "black";
      ctx.fillText("A", canvas.width / 2 - 97, 318);

      ctx.font = `20px Koulen`;
      ctx.fillStyle = `${user2personality.colors.cassetteAccent}`;
      ctx.fillText(`#${user2personality.name}`, canvas.width / 2, 580);

      ctx.font = `35px Koulen`;
      ctx.fillStyle = "black";
      ctx.fillText("B", canvas.width / 2 - 97, 520);

      // draw percent match to canvas
      ctx.font = "70px Koulen";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 6;
      ctx.miterLimit = 2; // fix miter bug
      ctx.strokeText(
        `${percentMatch(user1Data, user2Data)}% Match`,
        canvas.width / 2,
        220,
      );
      ctx.fillStyle = "white";
      ctx.fillText(
        `${percentMatch(user1Data, user2Data)}% Match`,
        canvas.width / 2,
        220,
      );

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (navigator.share) {
          // Web Share API is supported
          try {
            await navigator.share({
              title: "Unify with me!",
              text: `Compare our stats on Unify`,
              url: "",
              files: [
                new File([blob], "file.png", {
                  type: blob.type,
                }),
              ],
            });
          } catch (error) {
            // prevent cancelation of share from being error
          }
        } else {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);
            alert("Image copied to clipboard");
          } catch (error) {
            alert("Failed to copy to clipboard.");
          }
        }
      }, "image/png");
    };
  };

  // get names for the two users
  const user1Name = user1Data.userProfile.display_name;
  const user2Name = user2Data.userProfile.display_name;

  // combining the feature data for the two users to display in the radar chart
  // nivo requires the data for a chart to be in a specific format, so just converting to that format
  const map = {};
  user1Data.featuresData.forEach((item) => {
    map[item.feature] = item.value;
  });

  // this is what is actually combining the feature data from the two users
  const combinedFeaturesData = user2Data.featuresData.map((item) => {
    const userData = {};
    userData[user1Name] =
      map[item.feature] !== undefined ? map[item.feature] : undefined;
    userData[user2Name] = item.value;
    userData.feature = item.feature;
    return userData;
  });

  // get top genres for user 1 from their data
  const user1topGenres = Object.entries(user1Data.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  // get top genres for user 2 from their data
  const user2topGenres = Object.entries(user2Data.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  // calculate genre similarity between the two users
  const genreSimilarity = Math.round(
    calculateGenreSimilarity(user1Data.topGenres, user2Data.topGenres),
  );

  return (
    <>
      <div className="w-[70%] mx-auto flex justify-center items-end mt-12">
        <Boombox
          user1Data={user1Data}
          user2Data={user2Data}
          shareFunc={shareUnify}
        />
      </div>
      <div className="grid grid-cols-2 p-8 flex">
        {/* <style>
      @import
      url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
    </style> */}
        <div className="mb-2 mr-4 flex flex-col">
          <div className="lg:w-full">
            <Cassette
              userData={user1Data}
              userColors={user1personality.colors}
              side={"A"}
            />
          </div>
        </div>
        <div className=" ml-4 mb-2 flex flex-col">
          <div className="lg:w-full">
            <Cassette
              userData={user2Data}
              userColors={user2personality.colors}
              side={"B"}
            />
          </div>
        </div>
      </div>
      <div
        className="mt-2 mb-12"
        style={{ fontSize: 100, textAlign: "center" }}
      >
        {percentMatch(user1Data, user2Data)}% Match!
      </div>
      <div className="circle-row mt-8">
        <div className="circle">
          <span className="circle-text-large">
            {Math.round(
              calculateArtistSimilarity(
                user1Data.topArtists.map((artist) => artist.name),
                user2Data.topArtists.map((artist) => artist.name),
              ),
            )}
            %
          </span>
          <span className="circle-text-small">Artist Similarity</span>
        </div>
        <div className="circle">
          <span className="circle-text-large">{genreSimilarity}%</span>
          <span className="circle-text-small">Genres Shared</span>
        </div>
        <div className="circle">
          <span className="circle-text-large">
            {featureDataSimilarity(
              user1Data.featuresData,
              user2Data.featuresData,
            )}
            %
          </span>
          <span className="circle-text-small">Vibe Similarity</span>
        </div>
      </div>
      <div className="grid grid-cols-2 p-8 flex">
        <div
          className="text-black text-l p-3 mr-4"
          style={{
            fontSize: 50,
            backgroundColor: `${user1personality.colors.cassetteAccent}`,
            borderRadius: "10px",
          }}
        >
          Top Artists:
          <div className="mt-2" />
          <div className="w-2/3  mx-auto">
            <CDStack
              topList={user1Data.topArtists
                .slice(0, 8)
                .map((artist) => artist.name)}
              userColors={user1personality.colors}
            />
          </div>
        </div>
        <div
          className="text-black text-l p-3 ml-4"
          style={{
            fontSize: 50,
            backgroundColor: `${user2personality.colors.cassetteAccent}`,
            borderRadius: "10px",
          }}
        >
          Top Artists:
          <div className="mt-2" />
          <div className="w-2/3  mx-auto">
            <CDStack
              topList={user2Data.topArtists
                .slice(0, 8)
                .map((artist) => artist.name)}
              userColors={user2personality.colors}
            />
          </div>
        </div>
        <div className="text-black text-l mt-8" style={{ fontSize: 50 }}>
          Top Genres:
          {user1topGenres ? (
            <GenrePieChart
              data={user1topGenres}
              centerCircleColor={user1personality.colors.dark}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="text-black text-l mt-8" style={{ fontSize: 50 }}>
          Top Genres:
          {user2topGenres ? (
            <GenrePieChart
              data={user2topGenres}
              centerCircleColor={user2personality.colors.dark}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div
          className="text-black text-l p-3 mr-4"
          style={{
            fontSize: 50,
            backgroundColor: `${user1personality.colors.cassetteAccent}`,
            borderRadius: "10px",
          }}
        >
          Top Songs:
          <div className="mt-2" />
          <div className="w-2/3  mx-auto">
            <CDStack
              topList={user1Data.topSongs.slice(0, 8).map((song) => song.name)}
              userColors={user1personality.colors}
            />
          </div>
        </div>
        <div
          className="text-black text-l p-3 ml-4"
          style={{
            fontSize: 50,
            backgroundColor: `${user2personality.colors.cassetteAccent}`,
            borderRadius: "10px",
          }}
        >
          Top Songs:
          <div className="mt-2" />
          <div className="w-2/3  mx-auto">
            <CDStack
              topList={user2Data.topSongs.slice(0, 8).map((song) => song.name)}
              userColors={user2personality.colors}
            />
          </div>
        </div>
      </div>
      <div className="text-black text-l ml-12" style={{ fontSize: 50 }}>
        Song Features:
        <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
          {combinedFeaturesData ? (
            <div style={{ height: 400, fontSize: 20 }}>
              <ResponsiveRadar
                data={combinedFeaturesData}
                keys={[
                  user2Data.userProfile.display_name,
                  user1Data.userProfile.display_name,
                ]}
                indexBy="feature"
                valueFormat=">-.1f"
                maxValue="100"
                colors={[
                  user2personality.colors.bg,
                  user1personality.colors.dark,
                ]}
                margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
                gridLabelOffset={25}
                theme={{
                  text: {
                    fontSize: 25,
                    fill: "#333333",
                    outlineWidth: 10,
                    outlineColor: "transparent",
                    fontFamily: "var(--font-koulen)",
                  },
                }}
              />
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </>
  );
}

// Proptypes for all components

UnifyContent.propTypes = {
  user1Data: PropTypes.shape({
    userProfile: PropTypes.shape({
      display_name: PropTypes.string,
    }),
    featuresData: PropTypes.arrayOf(PropTypes.shape()),
    topGenres: PropTypes.shape({}),
    topSongs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topSongsMedium: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topSongsLong: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topArtists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topArtistsMedium: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topArtistsLong: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
  user2Data: PropTypes.shape({
    userProfile: PropTypes.shape({
      display_name: PropTypes.string,
    }),
    featuresData: PropTypes.arrayOf(PropTypes.shape()),
    topGenres: PropTypes.shape({}),
    topSongs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topSongsMedium: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topSongsLong: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topArtists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topArtistsMedium: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topArtistsLong: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export {
  calculateArtistSimilarity,
  calculateGenreSimilarity,
  featureDataSimilarity,
  UnifyContent,
};

export default UnifyContent;
