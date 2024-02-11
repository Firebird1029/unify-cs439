/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import axios from "axios";
import React, { useRef, useState, useEffect } from "react";

function HomeContent() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);

  const CLIENT_ID = "319f3f19b0794ac28b1df51ca946609c";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
  };

  const handleLogin = () => {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("response_type", RESPONSE_TYPE);
    params.append("redirect_uri", REDIRECT_URI);
    params.append(
      "scope",
      "user-read-private user-read-email user-library-read user-follow-read user-top-read user-modify-playback-state",
    );

    const url = `${AUTH_ENDPOINT}?${params.toString()}`;

    // Open Spotify login in a new window or redirect to the login URL
    window.open(url, "_blank");
  };

  const handleTokenFromCallback = () => {
    // Extract the token from the URL hash
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const newToken = urlParams.get("access_token");

    if (newToken) {
      setToken(newToken);
      window.localStorage.setItem("token", newToken);
    }
  };

  function RenderUserProfile() {
    if (!userProfile) {
      return <p>No user profile available.</p>;
    }
    return (
      <div>
        <p>Display Name: {userProfile.display_name}</p>
        <p>User URL: {userProfile.external_urls.spotify}</p>
        <p>URI: {userProfile.uri}</p>
        <p>Total Followers: {userProfile.followers.total}</p>
      </div>
    );
  }

  const RenderTopArtists = () => {
    return topArtists.map((artist) => <div key={artist.id}>{artist.name}</div>);
  };

  // Check for token in the URL hash when component mounts
  React.useEffect(() => {
    handleTokenFromCallback();
  }, []);

  React.useEffect(() => {
    console.log("Token:", token);

    if (token) {
      fetch(`http://localhost:5000/getUserProfile?token=${token}`)
        .then((res) => res.json())
        .then((data) => setUserProfile(data.profile))
        .then(console.log("got user profile"));
    }
  }, [token]);

  React.useEffect(() => {
    console.log("Token:", token);
    if (token) {
      fetch(`http://localhost:5000/getTopItems?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("top artists: ", data);
          setTopArtists(data.topItems);
        })
        .catch((error) => console.error("Error fetching top items:", error));
    }
  }, [token]);

  const buttonStyle =
    "bg-white text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!token && (
        <button
          type="button"
          className={`mt-4 ${buttonStyle}`}
          onClick={handleLogin}
        >
          Login to Spotify
        </button>
      )}

      {token && (
        <div className="mt-4">
          <button type="button" className={`${buttonStyle}`} onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {token && userProfile != null && (
        <div>User Profile:{RenderUserProfile()}</div>
      )}
      {token && <div>Your Top Artists:{RenderTopArtists()}</div>}
    </div>
  );
}

export default HomeContent;
