"use client";
import axios from "axios";
import React, { useState } from "react";

const HomeContent = () => {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const CLIENT_ID = "319f3f19b0794ac28b1df51ca946609c";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
  };

  const handleLogin = () => {
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-read-email&scope=user-library-read&scope=user-follow-read&scope=user-top-read`;

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

  const getUserProfile = async () => {
    if (!token) {
      console.error("Token not available. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setUserProfile(data);
      console.log(`user profile uri: ${data.uri}`);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const RenderUserProfile = () => {
    if (!userProfile) {
      return <p>No user profile available.</p>;
    } else {
      return (
        <div>
          <p>Display Name: {userProfile.display_name}</p>
          <p>User URL: {userProfile.external_urls.spotify}</p>
          <p>URI: {userProfile.uri}</p>
          <p>Total Followers: {userProfile.followers.total}</p>
        </div>
      );
    }
  };

  // Check for token in the URL hash when component mounts
  React.useEffect(() => {
    handleTokenFromCallback();
  }, []);

  const buttonStyle =
    "bg-white text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!token && (
        <button className={`mt-4 ${buttonStyle}`} onClick={handleLogin}>
          Login to Spotify
        </button>
      )}

      {token && (
        <div className="mt-4">
          <button className={`${buttonStyle}`} onClick={getUserProfile}>
            Get User Profile
          </button>
        </div>
      )}

      {token && (
        <div className="mt-4">
          <button className={`${buttonStyle}`} onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {token && <div>{RenderUserProfile()}</div>}
    </div>
  );
};

export default HomeContent;
