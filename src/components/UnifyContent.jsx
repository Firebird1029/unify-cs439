import { ResponsiveRadar } from "@nivo/radar";
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
      <div className="grid grid-cols-2 p-8 flex">
        <div className="bg-gray-100 rounded-lg p-4 mt-4 flex" />
        <div className="bg-gray-100 rounded-lg p-4 mt-4 ml-4 flex" />
      </div>
    </>
  );
}
export default UnifyContent;
