"use client";

import { useEffect } from "react";

function Home() {
  const handleTokenFromCallback = () => {
    console.log("handling token");
    // Extract the token from the URL hash
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const newToken = urlParams.get("access_token");

    console.log(newToken);

    if (newToken) {
      window.localStorage.setItem("token", newToken);
      window.location.replace("/userprofile");
    }
  };

  // Check for token in the URL hash when component mounts
  useEffect(() => {
    handleTokenFromCallback();
  }, []);

  return <div>loading...</div>;
}

export default Home;
