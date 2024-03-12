/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import { useState, useEffect } from "react";
import SongPlayer from "./SongPlayer";

function HomeContent() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  const [timeRangeTracks, setTimeRangeTracks] = useState("long_term");
  const [timeRangeArtists, setTimeRangeArtists] = useState("long_term");
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  const buttonStyle =
    "bg-white text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // User Profile Code from UserProfile.jsx

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
    if (token) {
      fetchTopItems("tracks", timeRangeTracks, 25).then(setTopTracks);
      fetchTopItems("artists", timeRangeArtists, 20).then(setTopArtists);
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
      const artists = await fetchTopItems("artists", timeRange, 20);
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

      const topLongTermTracks = await fetchTopItems("tracks", "long_term", 25);
      const seedTracks = topLongTermTracks.slice(0, 2).map((track) => track.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getRecommendations?token=${token}&limit=10&seed_genres=${topGenres.join(",")}&seed_tracks=${seedTracks.join(",")}`,
      );
      const data = await response.json();

      setRecommendedSongs(data.tracks);
    } catch (error) {
      console.error("Error in recommendation process:", error);
    }
  };

  return (
    <div className="">
      {token && userProfile != null && (
        <div>
          <p>Display Name: {userProfile?.display_name}</p>
          <p>User URL: {userProfile?.external_urls?.spotify}</p>
          <p>URI: {userProfile?.uri}</p>
          <p>Total Followers: {userProfile?.followers?.total}</p>
        </div>
      )}

      <div>
        <h2>Time Range for Tracks</h2>
        {timeRangeButtons("tracks")}
      </div>
      <div>
        {topTracks.map((track) => (
          <SongPlayer key={track.id} song={track} />
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
            <SongPlayer key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeContent;
