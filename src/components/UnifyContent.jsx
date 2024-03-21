import { ResponsiveRadar } from "@nivo/radar";
import "@/app/globals.css";

function UnifyContent({ user1Data, user2Data }) {
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
          @{user1Data.userProfile.display_name}
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 ml-4 flex flex-col">
        <p
          className="text-white text-xl font-koulen mb-24 mr-4 mt-4 ml-4"
          style={{
            fontSize: 60,
          }}
        >
          @{user2Data.userProfile.display_name}
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 mt-4 flex">
        <div
          className="text-black text-l font-koulen"
          style={{
            fontSize: 40,
          }}
        >
          Top Artists:
          <div className="mt-4" />
          {user1Data.topArtists.map((artist) => (
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
          Top Artists:
          <div className="mt-4" />
          {user2Data.topArtists.map((artist) => (
            <div>{artist.name}</div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 mt-4 flex">
        <div
          className="text-black text-l font-koulen"
          style={{
            fontSize: 40,
          }}
        >
          Top Songs:
          <div className="mt-4" />
          {user1Data.topSongs.map((song) => (
            <div>{song.name}</div>
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
          {user2Data.topSongs.map((song) => (
            <div>{song.name}</div>
          ))}
        </div>
      </div>
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        {user1Data.featuresData ? (
          <div style={{ height: 400 }}>
            <ResponsiveRadar
              data={user1Data.featuresData}
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
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        {user2Data.featuresData ? (
          <div style={{ height: 400 }}>
            <ResponsiveRadar
              data={user2Data.featuresData}
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
export default UnifyContent;
