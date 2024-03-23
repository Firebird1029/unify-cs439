"use client";

import { useEffect } from "react";

export default function UploadUser() {
  const handleTokenFromCallback = () => {
    // Extract the token from the URL hash
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const newToken = urlParams.get("access_token");

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
