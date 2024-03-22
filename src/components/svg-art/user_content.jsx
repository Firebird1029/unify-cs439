import { ResponsiveRadar } from "@nivo/radar";
import { ResponsivePie } from "@nivo/pie";
import "@/app/globals.css";

function UserContent({ userData, shareCassette, unify }) {
  // Convert object to array of { id: genre, value: frequency } objects
  const top5Genres = Object.entries(userData.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  return (
    <div className="grid grid-cols-2 p-8 flex">
      {/* <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
      </style> */}
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
        <p
          className="text-white text-xl font-koulen mb-24 mr-4 mt-4 ml-4"
          style={{
            fontSize: 60,
          }}
        >
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
            <span className="font-koulen text-gray-800 mr-2">
              Share Cassette
            </span>
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 ml-4 flex"> </div>
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        <div
          className="text-black text-l font-koulen"
          style={{
            fontSize: 40,
          }}
        >
          {" "}
          TOP GENRES:{" "}
        </div>
        {top5Genres ? (
          <div style={{ height: 400 }}>
            <ResponsivePie
              data={top5Genres}
              margin={{ top: 40, right: 140, bottom: 40, left: 140 }}
              innerRadius={0.25}
              keys={["value"]}
              colors={{ scheme: "category10" }}
              borderWidth={20}
              borderColor="black"
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              enableArcLabels={false}
              arcLabel="id"
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              isInteractive={false}
              animate={false}
              legends={[]}
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="bg-gray-100 rounded-lg p-4 mt-4 ml-4 flex">
        <div
          className="text-black text-l font-koulen"
          style={{
            fontSize: 40,
          }}
        >
          Top Artists:
          <div className="mt-4" />
          {userData.topArtists.map((artist) => (
            <div>{artist.name}</div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 mt-4 ml-4 flex">
        <div
          className="text-black text-l font-koulen"
          style={{
            fontSize: 40,
          }}
        >
          Top Songs:
          <div className="mt-4" />
          {userData.topSongs.map((song) => (
            <div>{song.name}</div>
          ))}
        </div>
      </div>
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        {userData.featuresData ? (
          <div style={{ height: 400 }}>
            <ResponsiveRadar
              data={userData.featuresData}
              keys={["value"]}
              indexBy="feature"
              valueFormat=">-.1f"
              maxValue="100"
              margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
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
