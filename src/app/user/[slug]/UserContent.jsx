/*
The content of the /user/[slug] page.
Contains info about a user's top genres, top artists, top songs, and song analysis.
*/

import { ResponsiveRadar } from "@nivo/radar";
import PropTypes from "prop-types";
import "@/app/globals.css";
import GenrePieChart from "@/shared/GenrePieChart";
import Boombox from "@/app/user/[slug]/Boombox";
import Cassette from "@/app/user/[slug]/Cassette";
import PaperTitle from "@/app/user/[slug]/PaperTitle";
import CDStack from "@/app/user/[slug]/CDStack";
import getPersonality from "@/shared/GetPersonality";
import PhotoMarquee from "@/app/user/[slug]/PhotoMarquee";
import PhotoGallery from "@/app/user/[slug]/PhotoGallery";

function UserContent({ userData, shareCassette }) {
  // Convert object to array of { id: genre, value: frequency } objects
  const top5Genres = Object.entries(userData.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  const userColors = getPersonality(userData).colors;

  console.log(userData.topSongs);

  return (
    <div
      style={{ backgroundColor: userColors.bg } /* Custom personality bg */}
      className="flex flex-col sm:pt-20 md:pt-10"
    >
      {/* top section, must be 100vh */}
      <div
        className="h-screen-2/3 \
                    md:h-screen"
      >
        {/* Boombox header, takes up 1/3-2/3 split on mobile
            and 1/2-1/2 split on larger screens */}
        <div
          className="rounded-lg pt-4 px-4 flex flex-col justify-end items-center \
                        h-1/2"
        >
          {/* Used for responsive sizing */}
          <div
            className="w-full flex flex-row justify-center items-end mt-12 w-[110%] \
                          md:w-[80%] md:mt-16 \
                          xl:w-[60%]"
          >
            <Boombox userData={userData} shareCassetteFunc={shareCassette} />
          </div>
        </div>
        {/* Spotlight transition, takes on light color + holds cassette */}
        <div
          style={{
            backgroundColor: userColors.light,
            clipPath: "polygon(27.5% 0%, 72.5% 0%, 100% 100%, 0% 100%)",
          }}
          className="h-1/2 flex flex-row justify-center"
        >
          <div
            className="justify-center items-center text-center font-koulen \
                            flex flex-col space-y-6 \ 
                            lg:flex-row lg:space-x-10"
          >
            <div className="w-[65%] lg:w-full">
              <Cassette
                userData={userData}
                userColors={userColors}
                side={"A"}
              />
            </div>
            <div
              style={{ color: userColors.dark }}
              className="flex flex-col justify-center items-center space-y-3 \
                            md:space-y-6"
            >
              <p
                className="text-4xl \
                              md:text-6xl"
              >
                See Breakdown
              </p>
              <div
                className="h-8 \
                                md:h-12"
              >
                <svg
                  className="animate-bounce"
                  width="100%"
                  height="100%"
                  viewBox="0 0 80 69"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40 69L0.162827 0L79.8372 0L40 69Z"
                    fill={userColors.dark}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bg takes on spotlight color afterwards, Main Body content */}
      <div
        style={{ backgroundColor: userColors.light }}
        className="lg:grid lg:grid-cols-2"
      >
        {/* Top Genres */}
        <div className="rounded-lg p-4 mt-4 ml-4">
          <div className="w-full flex flex-col items-center">
            <div
              className="w-80 \
                            md:w-64"
            >
              <PaperTitle>TOP GENRES:</PaperTitle>
            </div>
          </div>
          {top5Genres ? (
            <GenrePieChart data={top5Genres} centerCircleColor="#39466B" />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        {/* Song Analysis */}
        <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
          <div className="w-full flex flex-col items-center">
            <div
              className="w-80 \
                            md:w-64"
            >
              <PaperTitle>SONG ANALYSIS:</PaperTitle>
            </div>
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
        {/* CD Stacks Start Here */}
        {/* Top Artists CD Stack and Photo Gallery */}
        <div className="lg:col-span-2">
          <div className="w-full flex flex-col items-center">
            <div
              className="w-80 \
                            md:w-64"
            >
              <PaperTitle>TOP ARTISTS:</PaperTitle>
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-center \
                          lg:space-x-12 lg:flex-row"
          >
            {/* Photo marquee only shown on mobile, otherwise gallery */}
            <div className="lg:hidden">
              <PhotoMarquee
                imageLinks={userData.topArtists
                  .slice(0, 8)
                  .map((artist) => artist.images[1]?.url)}
              />
            </div>
            <div className="h-96 lg:h-full lg:w-1/3 lg:mt-12">
              <CDStack
                topList={userData.topArtists
                  .slice(0, 8)
                  .map((artist) => artist.name)}
                userColors={userColors}
              />
            </div>
            <div className="hidden lg:inline-block lg:w-1/2 p-10">
              <PhotoGallery
                imageLinks={userData.topArtists
                  .slice(0, 8)
                  .map((artist) => artist.images[1]?.url)}
              />
            </div>
          </div>
        </div>
        {/* TOP SONGS CD Stack */}
        <div className="lg:col-span-2">
          <div className="w-full flex flex-col items-center">
            <div
              className="w-80 \
                            md:w-64"
            >
              <PaperTitle>
                TOP <br />
                SONGS:
              </PaperTitle>
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-center \
                          lg:space-x-12 lg:flex-row-reverse"
          >
            {/* Photo marquee only shown on mobile, otherwise gallery */}
            <div className="lg:hidden">
              <PhotoMarquee
                imageLinks={userData.topSongs
                  .slice(0, 8)
                  .map((song) => song.album?.images[1]?.url)}
              />
            </div>
            <div className="h-96 lg:h-full lg:w-1/3 lg:mt-12">
              <CDStack
                topList={userData.topSongs.slice(0, 8).map((song) => song.name)}
                userColors={userColors}
              />
            </div>
            <div className="hidden lg:inline-block lg:w-1/2 p-10">
              <PhotoGallery
                imageLinks={userData.topSongs
                  .slice(0, 8)
                  .map((song) => song.album?.images[1]?.url)}
              />
            </div>
          </div>
        </div>
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
