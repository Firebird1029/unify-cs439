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
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setError] = useState(null);

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

  // Call loadFonts at the start of your application
  loadFonts();

  // Function to handle sharing
  const shareCassette = async () => {
    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(
      <ShareCassette userData={userData} />,
    );

    const img = new Image();

    const personality = getPersonality(userData);

    // Set the source of the image
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const fontLoadPromise = Promise.all([
      document.fonts.load("20px Koulen"),
      document.fonts.load("16px HomemadeApple"),
    ]);

    fontLoadPromise
      .then(() => {
        // Wait for the image to load
        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            setError("Unable to obtain 2D context for canvas.");
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);

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

          ctx.font = `20px Koulen`;
          ctx.fillStyle = `${personality.colors.light}`;
          ctx.fillText(`#${personality.name}`, canvas.width / 2, 460);

          ctx.font = `35px Koulen`;
          ctx.fillStyle = "black";
          ctx.fillText("A", canvas.width / 2 - 110, 393);

          // url to redirect user to, this brings up the unify page
          const shareURL = `http://${process.env.NEXT_PUBLIC_FRONTEND_URL}/unify/${userData.userProfile.id}`;

          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            if (navigator.share) {
              navigator
                .share({
                  title: "Unify with me!",
                  text: `Compare our stats on Uni.fy`,
                  url: shareURL,
                  files: [
                    new File([blob], "file.png", {
                      type: blob.type,
                    }),
                  ],
                })
                .catch(); // prevent cancelation of share from being error
            } else {
              try {
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
      })
      .catch();
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
          setUserData(data[0].spotify_data);
        }

        setLoading(false);
      });
  }, [slug]);

  return (
    <div>
      {!loading && userData && (
        <div>
          <UserContent
            userData={userData}
            shareCassette={shareCassette}
            unify={null}
          />
        </div>
      )}
      {!loading && !userData && !errorMessage && (
        <ErrorAlert
          Title="Error: "
          Message={"User not found."}
          RedirectTo="/"
        />
      )}
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
