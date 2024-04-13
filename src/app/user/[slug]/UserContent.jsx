/*
The content of the /user/[slug] page.
Contains info about a user's top genres, top artists, top songs, and song analysis.
*/

import { ResponsiveRadar } from "@nivo/radar";
import PropTypes from "prop-types";
import "@/app/globals.css";
import GenrePieChart from "@/shared/GenrePieChart";

function UserContent({ userData, shareCassette }) {
  // Convert object to array of { id: genre, value: frequency } objects
  const top5Genres = Object.entries(userData.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  return (
    <div
      className="flex flex-col \
                    md:grid md:grid-cols-2 md:p-8"
    >
      {/* <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
      </style> */}

      <div className="bg-[#39466B] rounded-lg p-4 flex flex-col">
        <p className="text-white text-5xl mb-24 mr-4 mt-4 ml-4">
          @{userData.userProfile.display_name}
        </p>
        <div className="flex flex-row justify-center">
          {/* <button
            type="button"
            className="bg-gray-300 rounded-full py-2.5 px-4 flex items-center mr-4"
            style={{
              cursor: "pointer",
              backgroundColor: "#D9D9D9",
              fontSize: 20,
            }}
            onClick={unify}
          >
            <span className="font-koulen text-gray-800 mr-2">Unify</span>
          </button> */}
          <button
            type="button"
            className="bg-gray-300 rounded-full py-2.5 px-4 flex items-center"
            style={{
              cursor: "pointer",
              backgroundColor: "#D9D9D9",
              fontSize: 20,
            }}
            onClick={shareCassette}
          >
            <span className="text-[#273049]">Share Cassette</span>
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 ml-4 flex"> </div>
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        <div
          className="text-black text-l"
          style={{
            fontSize: 45,
          }}
        >
          {" "}
          TOP GENRES:{" "}
        </div>
        {top5Genres ? (
          <GenrePieChart data={top5Genres} centerCircleColor="#39466B" />
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="bg-gray-100 rounded-lg p-4 mt-4 ml-4 flex">
        <div className="text-black text-l" style={{ fontSize: 50 }}>
          Top Artists:
          <div className="mt-2" />
          {userData.topArtists.slice(0, 8).map((artist) => (
            <div key={artist.id} style={{ fontSize: 35 }}>
              {artist.name}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 mt-4 ml-4 flex">
        <div className="text-black text-l" style={{ fontSize: 50 }}>
          Top Songs:
          <div className="mt-2" />
          {userData.topSongs.slice(0, 8).map((song) => (
            <div key={song.id} style={{ fontSize: 35 }}>
              {song.name}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        <div
          className="text-black text-l"
          style={{
            fontSize: 45,
          }}
        >
          {" "}
          SONG ANALYSIS:{" "}
        </div>
        {userData.featuresData ? (
          <div style={{ height: 450 }}>
            <ResponsiveRadar
              data={userData.featuresData}
              keys={["value"]}
              indexBy="feature"
              valueFormat=">-.1f"
              maxValue="100"
              margin={{ top: 65, right: 100, bottom: 35, left: 100 }}
              gridLabelOffset={20}
              theme={{
                text: {
                  fontSize: 20,
                  fill: "#333333",
                  outlineWidth: 10,
                  outlineColor: "transparent",
                  fontFamily: "var(--font-koulen)",
                },
              }}
              colors={"#39466B"}
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
export default UserContent;

UserContent.propTypes = {
  userData: PropTypes.shape({
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
  shareCassette: PropTypes.func.isRequired,
};
