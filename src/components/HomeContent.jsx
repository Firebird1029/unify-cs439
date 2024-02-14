/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import axios from "axios";
import React, { useRef, useState } from "react";

function removeDuplicates(strings) {
  const uniqueStringsSet = new Set(strings);
  const uniqueStringsArray = Array.from(uniqueStringsSet);
  return uniqueStringsArray;
}

function AddSongToQueue(uri, token) {
  console.log(token);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  axios.post(
    `https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%${uri}`,
    {},
    { headers },
  );
}

function SongPlayer({ song, token }) {
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
      <button
        type="button"
        onClick={togglePlay}
        style={{ cursor: "pointer", marginRight: "10px" }}
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <div>{song.name}</div>
      <audio ref={audioRef} src={song.preview_url}>
        <track kind="captions" />
      </audio>
      <button type="button" onClick={AddSongToQueue(song.uri, token)}>
        {" "}
        +{" "}
      </button>
    </div>
  );
}

function HomeContent() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topsongs, setTopSongs] = useState([]);
  const [recommendedSong, setRecommendedSong] = useState([]);
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

  function mode(arr) {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  }

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

  const FetchTopItems = async (
    limit = 5,
    TimeRange = "long_term",
    type = "artists",
  ) => {
    if (!token) {
      const errorMessage = "Token not available. Please log in.";
      console.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/me/top/${type}?time_range=${TimeRange}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.items;
    } catch (error) {
      console.error(`Error fetching top ${type}:`, error);
      return Promise.reject(error);
    }
  };

  const DisplayReccomendation = async () => {
    console.log("reccomendation");
    const topItems = await FetchTopItems(5, "short_term", "tracks");
    console.log(topItems);
    console.log("flag");
    let ids = [];
    for (let i = 0; i < topItems.length; i += 1) {
      console.log(topItems[i].id);
      ids = ids.concat(topItems[i].id);
    }
    console.log(ids);
    console.log(ids.join(", "));
    const { data } = await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${ids.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(data);
    console.log(data.tracks[0]);
    setRecommendedSong(data.tracks);
    // console.log(SongPlayer(data.tracks[0]))
    // return (<SongPlayer key={data.tracks[0].id} song={data.tracks[0]} />)
  };

  function DisplayUniquenessScore() {
    let uniqueness = 0;
    for (let i = 0; i < topartists.length; i++) {
      // console.log(topartists[i].popularity);
      uniqueness += topartists[i].popularity;
    }
    return (
      <div>
        Your Uniqueness Score:{" "}
        {(100 - uniqueness / topartists.length).toFixed(0)}%
      </div>
    );
  }

  function DisplayTopGenre() {
    let genres = [];
    for (let i = 0; i < topartists.length; i++) {
      genres = genres.concat(removeDuplicates(topartists[i].genres));
    }
    return <div>Your Top Genre: {mode(genres)}</div>;
  }

  const RenderTopSongs = () => {
    return topsongs.map((song) => (
      <SongPlayer key={song.id} song={song} token={token} />
    ));
  };

  const RenderTopArtists = () => {
    return topartists.map((artist) => <div key={artist.id}>{artist.name}</div>);
  };

  function RenderReccomendation() {
    return (
      <div>
        <h2>Recommended Songs:</h2>
        {recommendedSong.map((song) => (
          <SongPlayer key={song.id} song={song} token={token} />
        ))}
      </div>
    );
  }

  // Check for token in the URL hash when component mounts
  React.useEffect(() => {
    handleTokenFromCallback();
  }, []);

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

      {token && (
        <div className="mt-4">
          <button
            type="button"
            className={`${buttonStyle}`}
            onClick={getUserProfile}
          >
            Get User Profile
          </button>
        </div>
      )}

      {token && userProfile != null && (
        <div>User Profile:{RenderUserProfile()}</div>
      )}

      {token && userProfile != null && <div>{DisplayUniquenessScore()}</div>}

      {token && userProfile != null && <div>{DisplayTopGenre()}</div>}

      {token && (
        <div className="mt-4">
          <button
            type="button"
            className={`${buttonStyle}`}
            onClick={getTopSongs}
          >
            Get Top Songs
          </button>
        </div>
      )}

      {token && topsongs.length > 0 && (
        <div>Your Top Songs:{RenderTopSongs()}</div>
      )}

      {token && (
        <div className="mt-4">
          <button
            type="button"
            className={`${buttonStyle}`}
            onClick={getTopArtists}
          >
            Get Top Artists
          </button>
        </div>
      )}

      {token && topartists.length > 0 && (
        <div>Your Top Artists:{RenderTopArtists()}</div>
      )}

      {token && (
        <div className="mt-4">
          <button
            type="button"
            className={`${buttonStyle}`}
            onClick={DisplayReccomendation}
          >
            Display Reccomendation
          </button>
        </div>
      )}

      {token && recommendedSong.length > 0 && (
        <div>{RenderReccomendation()}</div>
      )}
    </div>
  );
}

export default HomeContent;
