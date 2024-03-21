import { ResponsiveRadar } from "@nivo/radar";
import { ResponsivePie } from "@nivo/pie";
import "@/app/globals.css";
import ReactDOMServer from "react-dom/server";
import ShareUnify from "@/components/svg-art/share_unify";

function calculateSimilarity(list1, list2) {
  const intersection = Object.keys(list1).filter((key) =>
    Object.prototype.hasOwnProperty.call(list2, key),
  ).length;
  const union = Object.keys({ ...list1, ...list2 }).length;
  const similarity = intersection / union;
  return similarity * 100; // Convert to percentage
}

function UnifyContent({ user1Data, user2Data }) {
  // console.log(user1Data.featuresData);
  // console.log(user2Data.featuresData);

  // Function to handle sharing
  const shareUnify = async () => {
    // console.log("sharing song");

    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(<ShareUnify />);
    // console.log(svgString);

    const img = new Image();

    // Set the source of the image
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    // Wait for the image to load
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Unable to obtain 2D context for canvas.");
        return;
      }

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
      ctx.font = "20px Koulen";
      ctx.fillStyle = "black";
      ctx.fillText(
        `@${user2Data.userProfile.display_name}`,
        canvas.width / 2,
        302,
      );
      ctx.fillText(
        `@${user1Data.userProfile.display_name}`,
        canvas.width / 2,
        501,
      );

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // console.log(blob);

        if (navigator.share) {
          // console.log("Web share API supported");
          navigator
            .share({
              title: "Unify with me!",
              text: `Compare our stats on Uni.fy`,
              url: "unify",
              files: [
                new File([blob], "file.png", {
                  type: blob.type,
                }),
              ],
            })
            .then(() => {
              // console.log("Shared successfully");
            })
            .catch((error) => console.error("Error sharing:", error));
        } else {
          // console.log("Web Share API not supported");
        }
      }, "image/png");
    };
  };

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

  const genreSimilarity = calculateSimilarity(
    user1Data.topGenres,
    user2Data.topGenres,
  );

  // console.log("combinedFeaturesData: ", combinedFeaturesData);

  return (
    <>
      <div
        className="font-koulen"
        style={{ fontSize: 100, textAlign: "center" }}
      >
        {" "}
        0% Match!
      </div>
      <div className="grid grid-cols-2 p-8 flex">
        {/* <style>
      @import
      url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
    </style> */}
        <div className="bg-blue-800 rounded-lg p-4 mb-4 flex flex-col">
          <p
            className="text-white text-xl font-koulen mb-24 mr-4 mt-4 ml-4"
            style={{
              fontSize: 60,
            }}
          >
            @{user1Data.userProfile.display_name}
          </p>
        </div>
        <div className="bg-red-800 rounded-lg p-4 ml-4 mb-4 flex flex-col">
          <p
            className="text-white text-xl font-koulen mb-24 mr-4 mt-4 ml-4"
            style={{
              fontSize: 60,
            }}
          >
            @{user2Data.userProfile.display_name}
          </p>
        </div>
      </div>
      <div className="circle-row mt-8">
        <div className="circle">
          <span className="circle-text-large">+5%</span>
          <span className="circle-text-small">Same Top Artist</span>
        </div>
        <div className="circle">
          <span className="circle-text-large">{genreSimilarity}%</span>
          <span className="circle-text-small">Genres Shared</span>
        </div>
        <div className="circle">
          <span className="circle-text-large">+10%</span>
          <span className="circle-text-small">Same Top Song</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          className="bg-gray-300 font-koulen rounded-full py-2.5 px-4 flex items-center mr-4"
          style={{
            cursor: "pointer",
            backgroundColor: "#d1d5db",
            fontSize: 30,
          }}
          onClick={shareUnify}
        >
          SHARE RESULTS
        </button>
      </div>
      <div className="grid grid-cols-2 p-8 flex">
        <div className="bg-gray-300 rounded-lg p-4 mt-4 flex">
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
        <div className="bg-gray-300 rounded-lg p-4 mt-4 ml-4 flex">
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
        <div className="bg-gray-300 rounded-lg p-4 mt-4 flex">
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
        <div className="bg-gray-300 rounded-lg p-4 mt-4 ml-4 flex">
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
      <ShareUnify />
    </>
  );
}
export default UnifyContent;
