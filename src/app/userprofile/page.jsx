/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import UserProfile from "@/components/UserProfile";

import UserContent from "@/components/svg-art/user_content";
import ShareCassette from "@/components/svg-art/share_cassette";

function App() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [featuresData, setFeaturesData] = useState(null);

  const fetchTopItems = async (type, timeRange, limit = 25) => {
    if (!token) {
      console.error("Token not available. Please log in.");
      return null;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=${type}&timeRange=${timeRange}&limit=${limit}`,
      );
      const data = await response.json();
      return data.topItems;
    } catch (error) {
      console.error(`Error fetching top ${type}:`, error);
      return error;
    }
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    console.log("Token:", token);

    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getUserProfile?token=${token}`,
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("user profile: ", data.profile);
          setUserProfile(data.profile);
        })
        .then(console.log("got user profile"));
    }
  }, [token]);

  useEffect(() => {
    console.log("Token:", token);
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=artists`,
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("top artists: ", data);
          setTopArtists(data.topItems);
        })
        .catch((error) => console.error("Error fetching top items:", error));
    }
  }, [token]);

  // Function to handle sharing
  const shareCassette = async () => {
    console.log("sharing song");

    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(
      <ShareCassette displayName={userProfile.display_name} />,
    );
    console.log(svgString);

    const img = new Image();

    // Set the source of the image
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    // Wait for the image to load
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      canvas.getContext("2d")?.drawImage(img, 0, 0);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        console.log(blob);

        if (navigator.share) {
          console.log("Web share API supported");
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
            .then(() => console.log("Shared successfully"))
            .catch((error) => console.error("Error sharing:", error));
        } else {
          console.log("Web Share API not supported");
        }
      }, "image/png");
    };
  };
  const unify = () => {
    console.log("unifying");
  };

  const getAverageAudioFeatures = async () => {
    const songs = await fetchTopItems("tracks", "long_term", 50);

    if (!songs) {
      console.error("failed to fetch top items");
      return null;
    }

    // Join track IDs into comma-separated list for input
    const trackIds = songs.map((track) => track.id).join(",");

    // Calculate the sum of popularity from the songs array
    // (popularity is in the songs array, whilst other data in audioFeatures)
    const popularitySum = songs.reduce((acc, song) => acc + song.popularity, 0);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getAudioFeatures?token=${token}&ids=${trackIds}`,
      );
      const data = await response.json();
      const audioFeatures = data.audio_features;

      // Sum all the normalised (0-100) features within the 'Audio Features' data
      const featuresSum = audioFeatures.reduce(
        (acc, feature) => {
          acc.acousticness += feature.acousticness;
          acc.danceability += feature.danceability;
          acc.energy += feature.energy;
          acc.instrumentalness += feature.instrumentalness;
          acc.speechiness += feature.speechiness;
          acc.valence += feature.valence;
          return acc;
        },
        {
          acousticness: 0,
          danceability: 0,
          energy: 0,
          instrumentalness: 0,
          speechiness: 0,
          valence: 0,
        },
      );

      // Get the average at 0-100, not 0-1
      const featuresAvg = Object.keys(featuresSum).reduce((acc, key) => {
        acc[key] = (featuresSum[key] * 100) / audioFeatures.length;
        return acc;
      }, {});

      // Add average popularity (already 0-100) to featuresAvg
      featuresAvg.popularity = popularitySum / songs.length;

      // Formatting to what is expected by Nivo
      // Note that when supporting multiple users, format is {feature, value, value2...}
      const formattedAvg = Object.keys(featuresAvg).map((key) => ({
        feature: key,
        value: featuresAvg[key],
      }));

      // console.log(formattedAvg);
      return formattedAvg;
    } catch (error) {
      console.error("Error fetching audio features:", error);
      return error;
    }
  };

  // useEffect to get the data from getAverageAudioFeatures and push it to a state
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAverageAudioFeatures();
      setFeaturesData(data);
      // console.log(data);
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="App">
      {userProfile !== null && topArtists !== null ? (
        <UserContent
          displayName={userProfile.display_name}
          userData={topArtists}
          shareCassette={shareCassette}
          unify={unify}
          featuresData={featuresData}
        />
      ) : null}
    </div>
  );
}

export default App;
