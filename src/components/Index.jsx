import React from "react";

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

  // Open Spotify login in same window, will redirect back
  window.open(url, "_self");
};

const handleTokenFromCallback = () => {
  // Extract the token from the URL hash
  const urlParams = new URLSearchParams(window.location.hash.substr(1));
  const newToken = urlParams.get("access_token");

  if (newToken) {
    // setToken(newToken);
    // window.localStorage.setItem("token", newToken);
  }
};

function Index() {
  return (
    <div>
      <h1 className="font-koulen">Welcome to Uni.fy!</h1>
      <button className="border rounded-full px-6 py-2 text-lg font-koulen">
        Log In
      </button>
      <button className="border rounded-full px-6 py-2 text-lg font-koulen">
        Enter Code
      </button>
    </div>
  );
}

export default Index;
