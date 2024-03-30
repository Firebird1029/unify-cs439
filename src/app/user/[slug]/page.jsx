"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";
import createClient from "@/utils/supabase/client";
import UserContent from "@/components/svg-art/user_content";
import ShareCassette from "@/components/svg-art/share_cassette";
import ErrorAlert from "@/app/error/error";

export default function UserPage({ params: { slug } }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setError] = useState(null);

  // Function to handle sharing
  const shareCassette = async () => {
    // Use Web Share API to share the default image
    const svgString = ReactDOMServer.renderToString(<ShareCassette />);

    const img = new Image();

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

      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      ctx.textAlign = "center";

      // Render the text onto the canvas
      ctx.font = "20px Koulen";
      ctx.fillStyle = "black";
      ctx.fillText(
        `@${userData.userProfile.display_name}`,
        canvas.width / 2,
        389,
      );

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (navigator.share) {
          navigator
            .share({
              title: "Unify with me!",
              text: `Compare our stats on Uni.fy`,
              url: `http://${process.env.NEXT_PUBLIC_FRONTEND_URL}/unify/${userData.userProfile.id}`,
              files: [
                new File([blob], "file.png", {
                  type: blob.type,
                }),
              ],
            })
            .catch((err) => {
              setError(`Error sharing: ${err}`);
            });
        } else {
          // Web share API not supported
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
      {errorMessage && !loading && (
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
