"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { loginWithSpotify } from "@/app/login/actions";
import Ipod from "@/components/svg-art/ipod";
import "@/app/globals.css";
import LeftPanel from "@/components/svg-art/left_panel";

export default function IndexContent() {
  const [loggedIn, setLogIn] = useState(false);
  const [cookies] = useCookies();

  // check if user is already logged in
  useEffect(() => {
    if (cookies && Object.keys(cookies).length > 0) {
      // already logged in
      // console.log("logged in");
      setLogIn(true);
    }
  }, []);

  function handleSignOut() {
    // Perform sign-out actions here, e.g., make an API request to sign the user out

    fetch("/auth/signout", { method: "POST" }).then((response) => {
      if (response.ok) {
        // Handle successful sign-out, e.g., redirect to login page
        window.location.href = "/";
      } else {
        // Handle sign-out failure
        // console.error("Sign-out failed");
      }
    });
    // .catch((error) => {
    //   // console.error("Error occurred during sign-out:", error);
    // });
  }

  return (
    <div className="h-screen relative">
      <div
        className="space-x-0 pt-12 px-12 border-10 border-red \
                    flex flex-col justify-center \
                    lg:flex-row lg:items-center lg:justify-end lg:space-x-12 lg:absolute lg:bottom-px"
      >
        {" "}
        {/* Keeps Ipod at Bottom for large screens */}
        <div
          className="w-[100%] self-end \
                        lg:w-[50%]"
        >
          <LeftPanel />
        </div>
        <div
          className="w-[100%] self-end \
                        lg:w-[50%]"
        >
          <Ipod>
            <div className="flex flex-col justify-center items-center text-center pt-10 space-y-10">
              <button
                className="border rounded-full bg-white px-5 py-3 text-3xl font-koulen \
                              transition hover:scale-110"
                type="button"
                onClick={() => loginWithSpotify()}
              >
                {loggedIn ? "Continue to Account" : "Log in with Spotify"}
              </button>
              <button
                className="border rounded-full bg-white px-5 py-3 text-3xl font-koulen \
                              transition hover:scale-110"
                type="button"
                onClick={() => handleSignOut()}
              >
                Logout
              </button>
            </div>
          </Ipod>
        </div>
      </div>
    </div>
  );
}
