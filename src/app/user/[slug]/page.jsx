/*
The user gets redirected to this page after logging in.
*/

/* eslint-disable no-alert */

"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";
import createClient from "@/utils/supabase/client";
import UserContent from "@/app/user/[slug]/UserContent";
import ShareCassette from "@/app/user/[slug]/ShareCassette";
import ErrorAlert from "@/app/error/error";
import getPersonality from "@/shared/GetPersonality";
import "@/app/globals.css";

export default function UserPage({ params: { slug } }) {
  // create supabase client
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setError] = useState(null);
  const [mabVersion, setMABVersion] = useState(1);
  const [clickedShare, setClickedShare] = useState(false);

  // preload fonts to fix bug
  async function loadFonts() {
    try {
      await Promise.all([
        document.fonts.load("20px Koulen"),
        document.fonts.load("16px HomemadeApple"),
      ]);
    } catch (error) {
      // console.error("Error loading fonts", error);
    }
  }

  // load the fonts
  loadFonts();

  // Function to handle sharing
  const shareCassette = async () => {
    // if the user has not clicked share already
    if (!clickedShare) {
      // update multi armed bandit clicks value
      supabase
        .from("mab")
        .select("clicks")
        .eq("id", mabVersion)
        .then(({ data }) => {
          supabase
            .from("mab")
            .update({ clicks: data[0].clicks + 1 }) // increment clicks
            .eq("id", mabVersion)
            .then(() => {
              setError("mab error"); // set error if mab update returned error
            });
        });
    }
    // set that user has clicked share to prevent updating clicked value multiple times
    setClickedShare(true);

    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(
      <ShareCassette userData={userData} />,
    );

    const img = new Image();

    // get personality
    const personality = getPersonality(userData);

    // Set the source of the image
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    // Wait for the image to load
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("Unable to obtain 2D context for canvas.");
        return;
      }

      // set width and height of the canvas based on the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // align text center
      ctx.textAlign = "center";

      ctx.font = `20px Koulen`;

      // Render the text onto the canvas
      ctx.font = `16px HomemadeApple`;
      ctx.fillStyle = "black";
      ctx.fillText(
        `@${userData.userProfile.display_name}`,
        canvas.width / 2,
        375,
      );

      // add personality name to canvas
      ctx.font = `20px Koulen`;
      ctx.fillStyle = `${personality.colors.cassetteAccent}`;
      ctx.fillText(`#${personality.name}`, canvas.width / 2, 460);

      // add cassette side letter to canvas
      ctx.font = `35px Koulen`;
      ctx.fillStyle = "black";
      ctx.fillText("A", canvas.width / 2 - 110, 393);

      // url to redirect user to, this brings up the unify page
      const shareURL = `http://${process.env.NEXT_PUBLIC_FRONTEND_URL}/unify/${userData.userProfile.id}`;

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Unify with me!",
              text: `Compare our stats on Uni.fy`,
              url: shareURL,
              files: [
                new File([blob], "file.png", {
                  type: blob.type,
                }),
              ],
            });
          } catch (error) {
            // prevent cancelation of share from being error
          }
        } else {
          try {
            // use navigator.clipboard if navigator.share is not available
            await navigator.clipboard.write([
              new ClipboardItem({
                "text/plain": new Blob([shareURL], {
                  type: "text/plain",
                }),
              }),
            ]);
            alert("Link copied to clipboard");
          } catch (error) {
            alert("Failed to copy to clipboard.");
          }
        }
      }, "image/png");
    };
  };

  useEffect(() => {
    // find user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", slug)
      .then(({ data, error }) => {
        if (error) {
          setError("User not found.");
        } else if (data && data.length > 0) {
          // set the user data with the data from supabase
          setUserData(data[0].spotify_data);
        }
        setLoading(false);
      });
  }, [slug]);

  // use multi arm bandit approach to pick which version of "share cassette" button to use
  // uses epsilon-greedy algorithm pulling data from supabase
  useEffect(() => {
    let mabValue = null;
    // get data on the designs from supabase
    supabase
      .from("mab")
      .select()
      .then(({ data, error }) => {
        if (error) {
          setError("MAB data not found.");
        } else if (data) {
          const epsilon = 0.1; // 10% of the time, explore
          if (Math.random() < epsilon) {
            // Exploration: Select a random ID
            const randomIndex = Math.floor(Math.random() * data.length);
            setMABVersion(data[randomIndex].id);
            mabValue = data[randomIndex].visits + 1;
            // increase number of visits for selected deisign by 1
            supabase
              .from("mab")
              .update({ visits: mabValue })
              .eq("id", data[randomIndex].id)
              .then(() => {
                setError("mab error"); // set error if mab update returned error
              });
          } else {
            // Exploitation: Select the ID with the highest clicks-to-visits ratio
            const bestOption = data.reduce((best, current) => {
              const bestCtr = best.clicks / best.visits;
              const currentCtr = current.clicks / current.visits;
              return currentCtr > bestCtr ? current : best;
            });
            setMABVersion(bestOption.id);
            mabValue = bestOption.visits + 1;
            // increase number of visits for selected deisign by 1
            supabase
              .from("mab")
              .update({ visits: mabValue })
              .eq("id", bestOption.id)
              .then(() => {
                setError("mab error"); // set error if mab update returned error
              });
          }
        }
      })
      .catch((err) => {
        setError(`Error fetching MAB data. Error: ${err.message}`);
      });
  }, []);

  return (
    <div>
      {/* show user content if the user data is available */}
      {!loading && userData && mabVersion && (
        <div>
          <UserContent
            userData={userData}
            shareCassette={shareCassette}
            unify={null}
            mabVersion={mabVersion}
          />
        </div>
      )}
      {/* show default error message if there is an error */}
      {!loading && !userData && !errorMessage && (
        <ErrorAlert
          Title="Error: "
          Message={"User not found."}
          RedirectTo="/"
        />
      )}
      {/* show error message */}
      {errorMessage && loading && (
        <ErrorAlert Title="Error: " Message={errorMessage} RedirectTo="/" />
      )}
    </div>
  );
}

UserPage.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};
