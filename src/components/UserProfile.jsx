/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import React, { useRef, useState, useEffect } from "react";
import NavbarComponent from "@/components/Navbar";

import SongPlayer from "./SongPlayer";

function UserProfile() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

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

    // Open Spotify login in same window, will redirect back
    window.open(url, "_self");
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

  // Check for token in the URL hash when component mounts
  React.useEffect(() => {
    handleTokenFromCallback();
  }, []);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  React.useEffect(() => {
    console.log("Token:", token);
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=tracks`,
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("top songs: ", data);
          setTopSongs(data.topItems);
        })
        .catch((error) => console.error("Error fetching top songs:", error));
    }
  }, [token]);

  const buttonStyle =
    "bg-white text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NavbarComponent
        onLogin={handleLogin}
        onLogout={logout}
        isLoggedIn={Boolean(token)}
      />

      {token && userProfile != null && (
        <div>
          <p>Display Name: {userProfile?.display_name}</p>
          <p>User URL: {userProfile?.external_urls?.spotify}</p>
          <p>URI: {userProfile?.uri}</p>
          <p>Total Followers: {userProfile?.followers?.total}</p>
        </div>
      )}
      {token && (
        <div>
          Your Top Artists:
          {topArtists.map((artist) => (
            <div key={artist.id}>{artist.name}</div>
          ))}
        </div>
      )}
      {token && (
        <div>
          Your Top Songs:
          {topSongs.map((song) => (
            <SongPlayer key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
