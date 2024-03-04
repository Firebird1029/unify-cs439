/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import axios from "axios";
import { useRef, useState, useEffect } from "react";
import NavbarComponent from "./Navbar";

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

function RenderUserProfile({ userProfile }) {
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

function DisplayUniquenessScore({ topArtists }) {
  let uniqueness = 0;
  for (let i = 0; i < topArtists.length; i++) {
    // console.log(topartists[i].popularity);
    uniqueness += topArtists[i].popularity;
  }
  return (
    <div>
      Your Uniqueness Score: {(100 - uniqueness / topArtists.length).toFixed(0)}
      %
    </div>
  );
}

function DisplayTopGenre({ topArtists }) {
  function mode(arr) {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  }

  let genres = [];
  for (let i = 0; i < topArtists.length; i++) {
    genres = genres.concat(removeDuplicates(topArtists[i].genres));
  }
  return <div>Your Top Genre: {mode(genres)}</div>;
}

function HomeContent() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  const [timeRangeTracks, setTimeRangeTracks] = useState("long_term");
  const [timeRangeArtists, setTimeRangeArtists] = useState("long_term");
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_ENDPOINT;
  const RESPONSE_TYPE = process.env.NEXT_PUBLIC_RESPONSE_TYPE;

  const buttonStyle =
    "bg-white text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline";

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

  const fetchTopItems = async (type, timeRange) => {
    if (!token) {
      console.error("Token not available. Please log in.");
      return null;
    }

    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${type === "tracks" ? 25 : 20}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.items;
    } catch (error) {
      console.error(`Error fetching top ${type}:`, error);
      return error;
    }
  };

  useEffect(() => {
    if (token) {
      fetchTopItems("tracks", timeRangeTracks).then(setTopTracks);
      fetchTopItems("artists", timeRangeArtists).then(setTopArtists);
    }
  }, [token, timeRangeTracks, timeRangeArtists]);

  const timeRangeButtons = (type) =>
    ["short_term", "medium_term", "long_term"].map((range) => (
      <button
        key={range}
        type="button"
        onClick={() =>
          type === "tracks"
            ? setTimeRangeTracks(range)
            : setTimeRangeArtists(range)
        }
        className={buttonStyle}
      >
        {range.replace("_", " ").toUpperCase()}
      </button>
    ));

  const getGenresFromArtists = async (timeRange) => {
    try {
      const artists = await fetchTopItems("artists", timeRange);
      return artists.flatMap((artist) => artist.genres);
    } catch (error) {
      console.error(`Error fetching genres for ${timeRange}:`, error);
      return [];
    }
  };

  /* 
  Recommender:
  1) gets three most frequent genres of top artists (over all time ranges)
  2) gets two most played tracks long_term
  3) Uses those as seeds
  */

  const getMostFrequentGenres = (genres) => {
    const frequency = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);
  };

  const displayRecommendation = async () => {
    if (!token) {
      console.error("Token not available. Please log in.");
      return;
    }

    try {
      const shortTermGenres = await getGenresFromArtists("short_term");
      const mediumTermGenres = await getGenresFromArtists("medium_term");
      const longTermGenres = await getGenresFromArtists("long_term");

      const combinedGenres = [
        ...shortTermGenres,
        ...mediumTermGenres,
        ...longTermGenres,
      ];
      const topGenres = getMostFrequentGenres(combinedGenres);

      const topLongTermTracks = await fetchTopItems("tracks", "long_term");
      const seedTracks = topLongTermTracks.slice(0, 2).map((track) => track.id);

      const { data } = await axios.get(
        `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${topGenres.join(",")}&seed_tracks=${seedTracks.join(",")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRecommendedSongs(data.tracks);
    } catch (error) {
      console.error("Error in recommendation process:", error);
    }
  };

  // Check for token in the URL hash when component mounts
  useEffect(() => {
    handleTokenFromCallback();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NavbarComponent
        onLogin={handleLogin}
        onLogout={logout}
        isLoggedIn={Boolean(token)}
      />

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
        <div>User Profile:{RenderUserProfile({ userProfile })}</div>
      )}

      {token && userProfile != null && (
        <div>{DisplayUniquenessScore({ topArtists })}</div>
      )}

      {token && userProfile != null && (
        <div>{DisplayTopGenre({ topArtists })}</div>
      )}

      <div>
        <h2>Time Range for Tracks</h2>
        {timeRangeButtons("tracks")}
      </div>
      <div>
        {topTracks.map((track) => (
          <SongPlayer key={track.id} song={track} token={token} />
        ))}
      </div>

      <div>
        <h2>Time Range for Artists</h2>
        {timeRangeButtons("artists")}
      </div>
      <div>
        {topArtists.map((artist) => (
          <div key={artist.id}>{artist.name}</div>
        ))}
      </div>

      {token && (
        <div className="mt-4">
          <button
            type="button"
            className={`${buttonStyle}`}
            onClick={displayRecommendation}
          >
            Display Recommendation
          </button>
        </div>
      )}

      {token && recommendedSongs.length > 0 && (
        <div>
          <h2>Recommended Songs:</h2>
          {recommendedSongs.map((song) => (
            <SongPlayer key={song.id} song={song} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeContent;
