/* eslint-disable no-console */
/* eslint-disable react/prop-types */

"use client";

import { useState, useEffect } from "react";
import UserProfile from "@/components/UserProfile";

import UserContent from "@/components/svg-art/user_content";

function App() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topArtists, setTopArtists] = useState(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

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

  useEffect(() => {
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

  const shareCassette = () => {
    console.log("sharing cassette");
  };

  const unify = () => {
    console.log("unifying");
  };

  return (
    <div className="App">
      {/* <UserProfile /> */}
      {userProfile !== null && topArtists !== null ? (
        <UserContent
          displayName={userProfile.display_name}
          userData={topArtists}
          shareCassette={shareCassette}
          unify={unify}
        />
      ) : null}
    </div>
  );
}

export default App;
