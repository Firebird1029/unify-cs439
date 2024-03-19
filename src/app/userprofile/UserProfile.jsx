"use client";

import { useState, useEffect } from "react";

import SongPlayer from "@/components/SongPlayer";

function UserProfile() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=artists`,
      )
        .then((res) => res.json())
        .then((data) => {
          setTopArtists(data.topItems);
        })
        .catch((error) => console.error("Error fetching top items:", error));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTopItems?token=${token}&type=tracks`,
      )
        .then((res) => res.json())
        .then((data) => {
          setTopSongs(data.topItems);
        })
        .catch((error) => console.error("Error fetching top songs:", error));
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
