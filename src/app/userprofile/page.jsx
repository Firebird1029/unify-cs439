"use client";

import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import UserContent from "@/components/svg-art/user_content";
import ShareCassette from "@/components/svg-art/share_cassette";

export default function UserProfilePage() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // useEffect to get user data object
  useEffect(() => {
    // console.log("Token:", token);
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/getUserData?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("user data: ", data);
          setUserData(data);
        })
        .catch(() => {
          // TODO ("Error fetching user data:", error)
        });
    }
  }, [token]);

  // Function to handle sharing
  const shareCassette = async () => {
    // console.log("sharing song");

    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(
      <ShareCassette displayName={userData.userProfile.display_name} />,
    );
    // console.log(svgString);

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
            .catch(() => {
              // TODO console.error("Error sharing:", error)
            });
        } else {
          // console.log("Web Share API not supported");
        }
      }, "image/png");
    };
  };

  const unify = () => {
    // console.log("unifying");
  };

  return (
    <div className="App">
      {userData !== null ? (
        <UserContent
          userData={userData}
          shareCassette={shareCassette}
          unify={unify}
        />
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
