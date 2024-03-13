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
    const svgString = ReactDOMServer.renderToString(ShareCassette());
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
              url: "uni.fy",
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

  return (
    <div className="App">
      {/* <UserProfile /> */}
      {userProfile !== null && topArtists !== null ? (
        <UserContent
          displayName={userProfile.display_name}
          userData={topArtists}
          shareCassette={shareCassette}
          unify={unify}
        />
      ) : null}
    </div>
  );
}

export default App;
