"use client";

import { useState, useEffect } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import SongPlayer from "@/components/SongPlayer";

function UserProfile2() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  const [timeRangeTracks, setTimeRangeTracks] = useState("long_term");
  const [timeRangeArtists, setTimeRangeArtists] = useState("long_term");
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  const [featuresData, setFeaturesData] = useState(null);

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
    // ("Token:", token);

    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getUserProfile?token=${token}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setUserProfile(data.profile);
        });
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
    };

    if (token) {
      fetchData();
    }
  }, [token]);

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

      {featuresData ? (
        <div style={{ height: 400 }}>
          <ResponsiveRadar
            data={featuresData}
            keys={["value"]}
            indexBy="feature"
            valueFormat=">-.1f"
            maxValue="100"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default UserProfile2;
