import { ResponsiveRadar } from "@nivo/radar";
import { ResponsivePie } from "@nivo/pie";
import "@/app/globals.css";

function UnifyContent({ user1Data, user2Data }) {
  // console.log(user1Data.featuresData);
  // console.log(user2Data.featuresData);

  const user1Name = user1Data.userProfile.display_name;
  const user2Name = user2Data.userProfile.display_name;

  const map = {};
  user1Data.featuresData.forEach((item) => {
    map[item.feature] = item.value;
  });

  const combinedFeaturesData = user2Data.featuresData.map((item) => {
    const userData = {};
    userData[user1Name] =
      map[item.feature] !== undefined ? map[item.feature] : undefined;
    userData[user2Name] = item.value;
    userData.feature = item.feature;
    return userData;
  });

  const user1topGenres = Object.entries(user1Data.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  const user2topGenres = Object.entries(user2Data.topGenres)
    .sort((a, b) => b[1] - a[1]) // Sort genres by frequency in descending order
    .slice(0, 5) // Get the top 5 genres
    .map(([id, value]) => ({ id, value })); // Map to { id: genre, value: frequency } objects

  // console.log("combinedFeaturesData: ", combinedFeaturesData);

  return (
    <>
      <div className="grid grid-cols-2 p-8 flex">
        {/* <style>
      @import
      url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
    </style> */}
        <div className="bg-blue-800 rounded-lg p-4 flex flex-col">
          <p
            className="text-white text-xl font-koulen mb-24 mr-4 mt-4 ml-4"
            style={{
              fontSize: 60,
            }}
          >
            @{user1Data.userProfile.display_name}
          </p>
        </div>
        <div className="bg-red-800 rounded-lg p-4 ml-4 flex flex-col">
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
        {user1topGenres ? (
          <div style={{ height: 400 }}>
            <ResponsivePie
              data={user1topGenres}
              margin={{ top: 40, right: 140, bottom: 40, left: 140 }}
              innerRadius={0.25}
              keys={["value"]}
              colors={{ scheme: "blues" }}
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
        {user2topGenres ? (
          <div style={{ height: 400 }}>
            <ResponsivePie
              data={user2topGenres}
              margin={{ top: 40, right: 140, bottom: 40, left: 140 }}
              innerRadius={0.25}
              keys={["value"]}
              colors={{ scheme: "reds" }}
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
      </div>
      <div className="rounded-lg p-4 mt-4 ml-4 justify-center">
        {combinedFeaturesData ? (
          <div style={{ height: 500 }}>
            <ResponsiveRadar
              data={combinedFeaturesData}
              keys={[
                user2Data.userProfile.display_name,
                user1Data.userProfile.display_name,
              ]}
              indexBy="feature"
              valueFormat=">-.1f"
              maxValue="100"
              colors={{ scheme: "set1" }}
              margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
              theme={{
                text: {
                  fontSize: 25,
                  fill: "#333333",
                  outlineWidth: 0,
                  outlineColor: "transparent",
                },
              }}
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
export default UnifyContent;
