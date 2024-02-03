"use client";
import axios from "axios";
import React, { useRef, useState } from "react";

const HomeContent = () => {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topsongs, setTopSongs] = useState([]);
  const [topartists, setTopArtists] = useState([]);

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

  const getTopSongs = async () => {
    if (!token) {
      console.error("Token not available. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("get top songs");
      console.log(data);
      setTopSongs(data.items);
    } catch (error) {
      console.error("Error fetching top songs:", error);
    }
  };

  const getTopArtists = async () => {
    if (!token) {
      console.error("Token not available. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("get top artists");
      console.log(data);
      setTopArtists(data.items);
    } catch (error) {
      console.error("Error fetching top songs:", error);
    }
  };

  const SongPlayer = ({ song }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
      const audioElement = audioRef.current;

      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }

      setIsPlaying(!isPlaying);
    };

    return (
      <div
        key={song.id}
        style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
      >
        <div
          onClick={togglePlay}
          style={{ cursor: "pointer", marginRight: "10px" }}
        >
          {isPlaying ? "⏸" : "▶️"}
        </div>
        <div>{song.name}</div>
        <audio ref={audioRef} src={song.preview_url} />
      </div>
    );
  };

  const RenderTopSongs = () => {
    return topsongs.map((song) => <SongPlayer key={song.id} song={song} />);
  };

  const RenderTopArtists = () => {
    return topartists.map((artist) => <div key={artist.id}>{artist.name}</div>);
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
          <button className={`${buttonStyle}`} onClick={getTopSongs}>
            Get Top Songs
          </button>
        </div>
      )}

      {token && (
        <div className="mt-4">
          <button className={`${buttonStyle}`} onClick={getTopArtists}>
            Get Top Artists
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

      {token && <div>User Profile:{RenderUserProfile()}</div>}

      {token && <div>Your Top Songs:{RenderTopSongs()}</div>}

      {token && <div>Your Top Artists:{RenderTopArtists()}</div>}
    </div>
  );
};

export default HomeContent;
